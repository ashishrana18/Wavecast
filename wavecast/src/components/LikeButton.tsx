import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState([]);

  const scale = useRef(new Animated.Value(1)).current;

  // ALWAYS mounted — prevents flicker/vanish issues
  const rot1 = useRef(new Animated.Value(0)).current;
  const rot2 = useRef(new Animated.Value(0)).current;
  const rot3 = useRef(new Animated.Value(0)).current;

  const noteOp1 = useRef(new Animated.Value(0)).current;
  const noteOp2 = useRef(new Animated.Value(0)).current;
  const noteOp3 = useRef(new Animated.Value(0)).current;

  const triggerLikeAnimation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();

    createParticleBurst();
    startNotesAnimation();

    setLiked((prev) => !prev);
  };

  const createParticleBurst = () => {
    const burst = [];

    for (let i = 0; i < 12; i++) {
      const p = {
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(1),
        size: Math.random() * 8 + 6,
        color: getRandomColor(),
        id: `${i}_${Math.random()}`
      };

      burst.push(p);

      Animated.parallel([
        Animated.timing(p.x, {
          toValue: (Math.random() - 0.5) * 120,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(p.y, {
          toValue: (Math.random() - 0.5) * 120,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true
        })
      ]).start();
    }

    setParticles(burst);
    setTimeout(() => setParticles([]), 900);
  };

  const getRandomColor = () => {
    const colors = ["#ff3b30", "#ff9500", "#af52de", "#0a84ff", "#30d158"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const rotateDeg = (value, deg) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: [`-${deg}deg`, `${deg}deg`]
    });

  const animateNote = (rot, op, delay, rotDur = 400, fadeDur = 900) => {
    rot.setValue(0);
    op.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(op, {
          toValue: 1,
          delay,
          duration: 350,
          useNativeDriver: true
        }),
        Animated.timing(op, {
          toValue: 0,
          duration: fadeDur,
          useNativeDriver: true
        })
      ]),
      Animated.sequence([
        Animated.timing(rot, {
          toValue: 1,
          delay,
          duration: rotDur,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(rot, {
          toValue: 0,
          duration: rotDur,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true
        })
      ])
    ]).start();
  };

  const startNotesAnimation = () => {
    animateNote(rot1, noteOp1, 0, 400, 650);
    animateNote(rot2, noteOp2, 120, 520, 700);
    animateNote(rot3, noteOp3, 240, 460, 680);
  };

  return (
    <View style={styles.container}>
      {/* PARTICLES BEHIND the thumb */}
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: 50,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }],
            zIndex: 0
          }}
        />
      ))}

      <View style={{ position: "relative", alignItems: "center" }}>
        {/* ALWAYS MOUNTED MUSIC NOTES */}
        <Animated.View
          style={{
            position: "absolute",
            top: -20,
            left: -45,
            opacity: noteOp1,
            transform: [{ rotate: rotateDeg(rot1, 18) }],
            zIndex: 20
          }}
        >
          <MaterialCommunityIcons name="music-note" size={32} color="#ff4d6d" />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            top: 30,
            right: -55,
            opacity: noteOp2,
            transform: [{ rotate: rotateDeg(rot2, 25) }],
            zIndex: 20
          }}
        >
          <MaterialCommunityIcons
            name="music-note-eighth"
            size={34}
            color="#ff80ff"
          />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            top: 70,
            left: 35,
            opacity: noteOp3,
            transform: [{ rotate: rotateDeg(rot3, 15) }],
            zIndex: 20
          }}
        >
          <MaterialCommunityIcons name="music" size={36} color="#b517ff" />
        </Animated.View>

        {/* LIKE BUTTON */}
        <TouchableOpacity
          onPress={triggerLikeAnimation}
          activeOpacity={0.8}
          style={{ backgroundColor: "transparent" }}
        >
          <Animated.Text
            style={{
              fontSize: 50,
              backgroundColor: "transparent",
              transform: [{ scale }]
            }}
          >
            <MaterialCommunityIcons
              name={liked ? "thumb-up" : "thumb-up-outline"}
              size={40}
              color={liked ? "#1DB954" : "white"}
            />
          </Animated.Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
