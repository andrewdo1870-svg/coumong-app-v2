Continue Work with andrewdo71@gmail.com Account - Manus

업그레이드

공유
pasted_content_3.txt
텍스트 · 4.70 KB
Lite
src/app/index.tsx 파일의 최종 수정본입니다. (파일 생성이 완료되어 다시 첨부해 드립니다.)
기존의 내용을 모두 지우고 이 파일의 내용으로 교체해 주세요. 특히 onShouldStartLoadWithRequest 부분을 보강하여 검색 시 발생할 수 있는 비정상적인 URL 요청으로 인한 앱 종료 현상을 방지하도록 설계했습니다.
교체 후 진행 방법:
파일 저장
빌드 및 제출 실행: eas build --platform ios --profile production --auto-submit
이번 수정으로 앱의 안정성이 크게 향상될 것입니다. 빌드 결과가 나오면 알려주세요! 이번에는 꼭 성공하시길 바랍니다.
index_final.tsx
코드 · 2.32 KB
이 작업의 모든 파일 보기
작업 완료
이 결과는 어땠나요?
추천 후속 질문
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, View, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { StatusBar } from "expo-status-bar";






Manus is an AI Agent and can make mistakes. Please double-check before use.

import React, { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, View, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={{ flex: 1 }}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: "https://coumong.com" }}
          style={styles.webview}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          
          // 비정상 종료 방지
          onContentProcessDidTerminate={() => {
            webViewRef.current?.reload();
          }}
          
          // URL 요청 필터링 (강제 종료 방어 핵심)
          onShouldStartLoadWithRequest={(request) => {
            // 일반적인 웹 주소는 모두 허용
            if (request.url.startsWith("http://") || request.url.startsWith("https://")) {
              return true;
            }
            // about:blank 등 내부 요청 허용
            if (request.url === "about:blank") {
              return true;
            }
            // 그 외 비정상적인 스키마(intent, tel 등)는 차단하여 크래시 방지
            console.log("Blocked potentially unstable URL:", request.url);
            return false;
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  webview: { flex: 1 },
});
