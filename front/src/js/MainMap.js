import "babylonjs-loaders";
import Game from "./Game";
import Communication from "./Communication"
import Camera from "./Camera";
import MapUtilities from "./MapUtilities";
import {AdvancedDynamicTexture, Button} from 'babylonjs-gui';
import firebase from "firebase";
import FightMap from "./FightMap";
import Gui from "./Gui";
import SkillTree from "./SkillTree";

export default class MainMap {
    constructor() {
        this.scene = new BABYLON.Scene(Game.ENGINE);
        this.camera = new Camera(this.scene, Game.CANVAS);
        Game.current_scene = Game.SCENES.push(this.scene) - 1;

        // Create Gui
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("Menu Principal", true, this.scene);

        let logOutButton = Button.CreateImageOnlyButton("Log out", "resources/images/icon_logout.png");
        Gui.setDefaultButtonCharacteristics(logOutButton, 48, -45);
        logOutButton.onPointerClickObservable.add(() => {
            firebase.auth().signOut();
        });
        this.advancedTexture.addControl(logOutButton);

        let subscribeFightButton = Button.CreateImageOnlyButton("Fight !", "resources/images/icon_sword.png");
        Gui.setDefaultButtonCharacteristics(subscribeFightButton, -45, 25);
        Gui.surroundWithColor(subscribeFightButton);
        subscribeFightButton.isSubscribingFight = false;
        subscribeFightButton.onPointerClickObservable.add(() => {
            subscribeFightButton.isSubscribingFight = !subscribeFightButton.isSubscribingFight;
            if (subscribeFightButton.isSubscribingFight) {
                subscribeFightButton.subscription = Communication.clientSocket.subscribe("/broker/fight", message => {
                    subscribeFightButton.subscription.unsubscribe();
                    this.scene.dispose();
                    this.advancedTexture.dispose();
                    new FightMap(message.body)
                });
                Communication.sendMessage("/fight/subscribe", {});
            } else {
                Communication.sendMessage("/fight/unsubscribe", {});
                subscribeFightButton.subscription.unsubscribe();
            }
        });
        this.advancedTexture.addControl(subscribeFightButton);

        let skillTreeButton = Button.CreateImageOnlyButton("Arbre de compétence", "resources/images/icon_parchemin.png");
        Gui.setDefaultButtonCharacteristics(skillTreeButton, -45, 40);
        Gui.surroundWithColor(skillTreeButton);
        skillTreeButton.onPointerClickObservable.add(() => {
            this.scene.dispose();
            new SkillTree();
        });
        this.advancedTexture.addControl(skillTreeButton);

        //Uncomment to see axis (debug purpose)
        // MapUtilities.showWorldAxis(1, this.scene);
        MapUtilities.createLight(this.scene);
        MapUtilities.createSkybox(this.scene);

        MapUtilities.addMoveListener(this.scene);

        // Get all map
        Communication.mockRestApi("/user/getAllMap", message => MapUtilities.getAllMap(message, this.scene));
        Communication.sendMessage("/getAllMap", null);
        Communication.clientSocket.subscribe("/broker/command", message => MapUtilities.updateMap(message, this.scene));
    }
};
