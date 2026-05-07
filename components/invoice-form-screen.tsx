import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendInvoiceEmail } from '../services/sendInvoiceEmail';

const PROVIDERS = ['IMISA', 'REFAX', 'MANNHHEIM', 'AUTOMARCO', 'NORIEGA', 'CUATRO RUEDAS'];

const API_URL = 'https://repnetfacturas-backend.onrender.com';

export function InvoiceFormScreen() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [comment, setComment] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [attachedPhotoUri, setAttachedPhotoUri] = useState<string | null>(null);
  const [previewPhotoUri, setPreviewPhotoUri] = useState<string | null>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCameraPress = async () => {
    try {
      const { default: DocumentScanner, ResponseType } = await import(
        'react-native-document-scanner-plugin'
      );

      const { scannedImages = [] } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
        croppedImageQuality: 100,
        responseType: ResponseType.ImageFilePath,
      });

      if (scannedImages.length > 0) {
        setPreviewPhotoUri(scannedImages[0]);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No fue posible abrir el escaner de documentos.';

      if (message.includes('could not be found') || message.includes('TurboModuleRegistry')) {
        Alert.alert(
          'Development build requerida',
          'Para usar el escaner de facturas necesitas generar e instalar una development build con el modulo nativo incluido.'
        );
        return;
      }

      Alert.alert(
        'Escaner no disponible',
        `${message}\n\nSi aun no has generado tu development build, este modulo nativo no estara disponible dentro de Expo Go.`
      );
    }
  };

  const handleAcceptPreview = () => {
    if (!previewPhotoUri) {
      return;
    }

    setAttachedPhotoUri(previewPhotoUri);
    setPreviewPhotoUri(null);
  };

  const handleBackToForm = () => {
    setPreviewPhotoUri(null);
  };

const handleSubmit = async () => {
  const missingFields: string[] = [];

  if (!attachedPhotoUri) {
    missingFields.push('Debes adjuntar o tomar una fotografia.');
  }

  if (!selectedProvider) {
    missingFields.push('Debes seleccionar un proveedor.');
  }

  if (!invoiceNumber.trim()) {
    missingFields.push('Debes ingresar un numero de factura.');
  }

  if (!comment.trim()) {
    missingFields.push('Debes ingresar un comentario.');
  }

  if (missingFields.length > 0) {
    Alert.alert(
      'Faltan datos',
      missingFields.map((field, index) => `${index + 1}. ${field}`).join('\n')
    );
    return;
  }

  try {
    setIsSending(true);

    await sendInvoiceEmail({
      imageUri: attachedPhotoUri!,
      provider: selectedProvider,
      invoiceNumber,
      comment,
      apiUrl: API_URL,
    });

    Alert.alert('Factura enviada', 'La factura fue enviada correctamente por correo.');

    setAttachedPhotoUri(null);
    setSelectedProvider('');
    setInvoiceNumber('');
    setComment('');
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible enviar la factura por correo.';

    Alert.alert('Error al enviar factura', message);
  } finally {
    setIsSending(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={false}>
          <Image
            source={require('@/assets/images/repnetsolo_logo.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <View style={styles.captureRow}>
            <View style={styles.captureColumn}>
              <Pressable style={styles.cameraButton} onPress={handleCameraPress}>
                <Ionicons name="camera" size={44} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.photoStatus}>
                {attachedPhotoUri ? '' : 'Aun no se ha adjuntado fotografia'}
              </Text>
            </View>

            {attachedPhotoUri ? (
              <Pressable
                style={styles.documentPreviewButton}
                onPress={() => setIsImageViewerVisible(true)}>
                <Image
                  source={{ uri: attachedPhotoUri }}
                  style={styles.documentPreview}
                  contentFit="cover"
                />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.formSection}>
            <View style={styles.inlineField}>
              <Text style={styles.inlineLabel}>Proveedor:</Text>
              <Pressable style={styles.inputBox} onPress={() => setIsDropdownVisible(true)}>
                <Text style={[styles.inputText, !selectedProvider && styles.placeholderText]}>
                  {selectedProvider || 'Seleccionar'}
                </Text>
                <Ionicons name="chevron-down" size={28} color="#4B5563" />
              </Pressable>
            </View>

            <View style={styles.inlineField}>
              <Text style={styles.inlineLabel}>Numero Factura:</Text>
              <TextInput
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                placeholder="Ingresar numero"
                placeholderTextColor="#6B7280"
                style={styles.inputBox}
              />
            </View>

            <View style={styles.commentField}>
              <Text style={styles.commentLabel}>Comentario:</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Escribe un comentario"
                placeholderTextColor="#6B7280"
                multiline
                textAlignVertical="top"
                style={styles.commentInput}
              />
            </View>
          </View>

        <Pressable
          style={[styles.submitButton, isSending && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSending}>
          <Ionicons name="mail-outline" size={30} color="#FFFFFF" />
          <Text style={styles.submitText}>
            {isSending ? 'Enviando factura...' : 'Enviar factura'}
          </Text>
        </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent
        visible={isDropdownVisible}
        onRequestClose={() => setIsDropdownVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsDropdownVisible(false)}>
          <Pressable style={styles.dropdownModal} onPress={() => undefined}>
            {PROVIDERS.map((provider) => (
              <Pressable
                key={provider}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedProvider(provider);
                  setIsDropdownVisible(false);
                }}>
                <Text style={styles.dropdownItemText}>{provider}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        visible={!!previewPhotoUri}
        onRequestClose={handleBackToForm}>
        <SafeAreaView style={styles.previewSafeArea}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Vista previa del escaneo</Text>
            <Text style={styles.previewSubtitle}>
              Revisa la factura escaneada antes de adjuntarla.
            </Text>
          </View>

          <View style={styles.previewImageWrapper}>
            {previewPhotoUri ? (
              <Image
                source={{ uri: previewPhotoUri }}
                style={styles.previewImage}
                contentFit="contain"
              />
            ) : null}
          </View>

          <View style={styles.previewActions}>
            <Pressable style={styles.previewSecondaryButton} onPress={handleBackToForm}>
              <Text style={styles.previewSecondaryButtonText}>Volver</Text>
            </Pressable>
            <Pressable style={styles.previewPrimaryButton} onPress={handleAcceptPreview}>
              <Text style={styles.previewPrimaryButtonText}>Aceptar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}>
        <View style={styles.viewerOverlay}>
          <SafeAreaView style={styles.viewerSafeArea}>
            <Pressable style={styles.viewerCloseButton} onPress={() => setIsImageViewerVisible(false)}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </Pressable>

            <View style={styles.viewerImageWrapper}>
              {attachedPhotoUri ? (
                <Image
                  source={{ uri: attachedPhotoUri }}
                  style={styles.viewerImage}
                  contentFit="contain"
                />
              ) : null}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 48,
  },
  logo: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
    marginBottom: 30,
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 42,
  },
  captureColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    width: 90,
    height: 90,
    borderRadius: 68,
    backgroundColor: '#4A7DF0',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  photoStatus: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    maxWidth: 120,
  },
  documentPreviewButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  documentPreview: {
    width: 86,
    height: 118,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  formSection: {
    gap: 25,
  },
  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  inlineLabel: {
    width: 130,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputBox: {
    flex: 1,
    minHeight: 40,
    borderWidth: 2,
    borderColor: '#D35A5A',
    borderRadius: 15,
    paddingHorizontal: 26,
    fontSize: 15,
    color: '#374151',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
    color: '#374151',
  },
  placeholderText: {
    color: '#6B7280',
  },
  commentField: {
    marginTop: 22,
    gap: 14,
  },
  commentLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentInput: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#D35A5A',
    borderRadius: 15,
    paddingHorizontal: 26,
    paddingVertical: 22,
    fontSize: 17,
    color: '#374151',
  },
  submitButton: {
    minHeight: 68,
    marginTop: 'auto',
    marginBottom: 4,
    borderRadius: 15,
    backgroundColor: '#4A7DF0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  submitButtonDisabled: {
  opacity: 0.65,
},
  submitText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dropdownModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 12,
  },
  dropdownItem: {
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  dropdownItemText: {
    fontSize: 17,
    color: '#1F2937',
  },
  previewSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  previewHeader: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  previewSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  previewImageWrapper: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    padding: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
  },
  previewSecondaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D35A5A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  previewSecondaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#D35A5A',
  },
  previewPrimaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7DF0',
  },
  previewPrimaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
  },
  viewerSafeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  viewerCloseButton: {
    alignSelf: 'flex-end',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 4,
    marginBottom: 12,
  },
  viewerImageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
});
