import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinishOnboarding: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinishOnboarding }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = React.useRef<PagerView>(null);

  const onboardingData = [
    {
      key: '1',
      title: '다양한 쇼핑몰 상품을 한눈에!',
      description: '쿠몽에서 여러 쇼핑몰의 상품을 한 번에 검색하고 비교하세요.',
      image: require('../assets/onboarding1.png'), // Placeholder image
    },
    {
      key: '2',
      title: '최저가 검색으로 현명한 소비!',
      description: '원하는 상품의 최저가를 찾아 합리적인 쇼핑을 즐기세요.',
      image: require('../assets/onboarding2.png'), // Placeholder image
    },
    {
      key: '3',
      title: '나만의 찜 목록으로 편리하게!',
      description: '관심 있는 상품을 찜하고 언제든지 다시 확인하세요.',
      image: require('../assets/onboarding3.png'), // Placeholder image
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      onFinishOnboarding();
    }
  };

  const handleSkip = () => {
    onFinishOnboarding();
  };

  const dotPosition = useSharedValue(0);

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dotPosition.value }],
    };
  });

  React.useEffect(() => {
    dotPosition.value = withTiming(currentPage * 12, { duration: 150, easing: Easing.linear });
  }, [currentPage]);

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {onboardingData.map((item) => (
          <View key={item.key} style={styles.page}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentPage && styles.activeDot]}
            />
          ))}
          <Animated.View style={[styles.activeDotIndicator, animatedDotStyle]} />
        </View>

        <View style={styles.buttonsContainer}>
          {currentPage < onboardingData.length - 1 ? (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>건너뛰기</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButton} /> // Placeholder to maintain layout
          )}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPage < onboardingData.length - 1 ? '다음' : '시작하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: 'transparent', // Active dot is handled by the animated indicator
  },
  activeDotIndicator: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8456B',
    left: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#E8456B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default OnboardingScreen;
