import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, Linking } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { useTranslation } from "react-i18next";

let triggerModal: (() => void) | null = null;

export const askForFeedbackInit = (showFn: () => void) => {
  triggerModal = showFn;
};

export const askForFeedback = () => {
  if (triggerModal) {
    triggerModal();
  } else {
    console.warn("askForFeedback not initialized yet");
  }
};

export type FeedbackModalRef = {
  show: () => void;
};

export const FeedbackModal = forwardRef<FeedbackModalRef>((_, ref) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"ask" | "choice" | null>("ask");

  useImperativeHandle(ref, () => ({
    show: () => {
      setStep("ask");
      setVisible(true);
    },
  }));

  const handleClose = () => setVisible(false);

  const goToChoice = () => setStep("choice");

  const handleRate = () => {
    const url = Platform.select({
      ios: "itms-apps://itunes.apple.com/app/id6742723534?action=write-review",
      android: "market://details?id=com.carsam.buyeuropean",
    });
    if (url) Linking.openURL(url);
    handleClose();
  };

  const handleEmail = () => {
    MailComposer.composeAsync({
      recipients: ["buy-european@googlegroups.com"],
      subject: t("feedback.appFeedbackSubject"),
      body: "",
    });
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {step === "ask" && (
            <>
              <Text style={styles.title}>{t("feedback.askTitle")}</Text>
              <TouchableOpacity style={styles.button} onPress={goToChoice}>
                <Text style={styles.buttonText}>{t("feedback.askPositive")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonOutline} onPress={handleEmail}>
                <Text style={styles.buttonOutlineText}>{t("feedback.askNegative")}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === "choice" && (
            <>
              <Text style={styles.title}>{t("feedback.choiceTitle")}</Text>
              <TouchableOpacity style={styles.button} onPress={handleRate}>
                <Text style={styles.buttonText}>{t("feedback.choiceReview")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonOutline} onPress={handleEmail}>
                <Text style={styles.buttonOutlineText}>{t("feedback.choiceEmail")}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 22,
    color: "#888",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 30,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: "#3b82f6",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonOutlineText: {
    color: "#3b82f6",
    textAlign: "center",
    fontSize: 16,
  },
});
