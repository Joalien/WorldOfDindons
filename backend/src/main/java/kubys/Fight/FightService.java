package kubys.Fight;

import kubys.Map.MapService;
import kubys.Player.Player;
import kubys.Player.PlayerService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@Data
public class FightService {
    public static final java.util.Map<String, Fight> FIGHTS = new HashMap<>();

    public Fight generateFight(List<Player> players) {
        Fight fight = new Fight.FightBuilder()
                .uuid(UUID.randomUUID().toString())
                .map(MapService.generateFightMap())
                .players(players)
                .build();
        boolean canMoveAllPlayer = players.stream().allMatch(player -> PlayerService.switchMap(player, fight.getMap()));

        if (!canMoveAllPlayer) {
            log.error("Fight : " + fight);
            throw new IllegalStateException("Some users can't be move towards new Map !");
        }

        FIGHTS.put(fight.getUuid(), fight);
        return fight;
    }

}
