import { StatusBar } from "expo-status-bar";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  TextInput,
} from "react-native";

const { width, height } = Dimensions.get("window");

const color = {
  black: "#323f4e",
  red: "#f76a6a",
  text: "#fff",
};

const timer = [...Array(13).keys()].map((a) => (a === 0 ? 1 : a * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const App = () => {
  const inputRef: any = useRef()
  const scrollX = useRef(new Animated.Value(0)).current;
  const timerAnimation = useRef(new Animated.Value(height)).current;
  const textInputAnimation = useRef(new Animated.Value(timer[0])).current
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const [duration, setduration] = useState(timer[0]);


  useEffect(() => {
    let listener = textInputAnimation.addListener(({value}) => {
         inputRef?.current?.setNativeProps({
          text: Math.ceil(value).toString()
         })
    })
  
    return () => {
      textInputAnimation.removeListener(listener)
      textInputAnimation.removeAllListeners()
    }
  })

  const countDownAnimation = useCallback(() => {
    textInputAnimation.setValue(duration)
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(timerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
     Animated.parallel([
      Animated.timing(textInputAnimation, {
        toValue: 0,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(timerAnimation, {
        toValue: height,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
     ]),
     Animated.delay(400)
    ]).start(() => {
      textInputAnimation.setValue(duration)
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }, [duration]);

  const buttonOpacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const textOpacity = buttonAnimation.interpolate({
    inputRange: [0, 0],
    outputRange: [0, 1],
  });

  const buttonTranslateY = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            flex: 1,
            height,
            width,
            backgroundColor: color.red,
            transform: [{ translateY: timerAnimation }],
          },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
          },
        ]}
      >
        <TouchableOpacity onPress={countDownAnimation}>
          <Animated.View
            style={{
              width: 60,
              height: 60,
              backgroundColor: color.red,
              borderRadius: 30,
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            }}
          ></Animated.View>
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: "absolute",
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width,
            justifyContent: "center",
            alignItems: "center",
            opacity: textOpacity
          }}
        >
          <TextInput
            ref={inputRef}
            style={{
              fontSize: 100,
              color: color.text,
              fontWeight: "bold",
             
            }}
            defaultValue={duration.toString()}
          />
        </Animated.View>
        <Animated.FlatList
          data={timer}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = event.nativeEvent.contentOffset.x / ITEM_SIZE;
            setduration(timer[Math.round(index)]);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
            }
          )}
          contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
          style={{ flexGrow: 0 , opacity: buttonOpacity}}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => {
            const input_range = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];
            const opacity = scrollX.interpolate({
              inputRange: input_range,
              outputRange: [0.4, 1, 0.4],
            });
            const scale = scrollX.interpolate({
              inputRange: input_range,
              outputRange: [0.7, 1, 0.7],
            });
            return (
              <View
                style={{
                  width: ITEM_SIZE,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.Text
                  style={{
                    fontSize: 100,
                    color: color.text,
                    fontWeight: "bold",
                    opacity,
                    transform: [{ scale }],
                  }}
                >
                  {item}
                </Animated.Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
