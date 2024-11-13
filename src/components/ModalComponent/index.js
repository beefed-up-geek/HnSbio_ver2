// src\components\ModalComponent\index.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './styles'; // Adjust the import path if needed

const ModalComponent = ({
  visible,
  title,
  label,
  value,
  setValue,
  onClose,
  placeholder,
  maxLength,
  keyboardType = 'default',
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalVisibleBackground}
      activeOpacity={1}
      onPress={onClose}
    ></TouchableOpacity>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{title}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#828287"
          maxLength={maxLength}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
        />
      </View>
      <View style={styles.modalSaveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ModalComponent;
