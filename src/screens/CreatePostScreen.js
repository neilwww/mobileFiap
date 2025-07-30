import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import mockAPI from '../services/api';

const CreatePostScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !description.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      await mockAPI.createPost({
        title: title.trim(),
        content: content.trim(),
        description: description.trim(),
        tags: tags
      });

      Alert.alert(
        'Sucesso',
        'Post criado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível criar o post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || content || description || tags.length > 0) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartar?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Criar Novo Post</Title>
            
            <TextInput
              label="Título *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Digite o título do post"
            />

            <TextInput
              label="Descrição *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              placeholder="Uma breve descrição do post"
              multiline
              numberOfLines={2}
            />

            <TextInput
              label="Conteúdo *"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              style={styles.contentInput}
              placeholder="Digite o conteúdo completo do post..."
              multiline
              numberOfLines={10}
            />

            {/* Tags Section */}
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              
              <View style={styles.tagInputContainer}>
                <TextInput
                  label="Adicionar tag"
                  value={tagInput}
                  onChangeText={setTagInput}
                  mode="outlined"
                  style={styles.tagInput}
                  placeholder="Ex: javascript, react, programação"
                  onSubmitEditing={handleAddTag}
                />
                <Button
                  mode="contained"
                  onPress={handleAddTag}
                  style={styles.addTagButton}
                  disabled={!tagInput.trim()}
                  compact
                >
                  Adicionar
                </Button>
              </View>

              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      style={styles.tag}
                      onClose={() => handleRemoveTag(tag)}
                      closeIcon="close"
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </View>

            {/* Character counts */}
            <View style={styles.counters}>
              <Text style={styles.counter}>
                Título: {title.length}/100
              </Text>
              <Text style={styles.counter}>
                Descrição: {description.length}/200
              </Text>
              <Text style={styles.counter}>
                Conteúdo: {content.length}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={loading || !title.trim() || !content.trim() || !description.trim()}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  'Publicar Post'
                )}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Preview Card */}
        {(title || description) && (
          <Card style={styles.previewCard}>
            <Card.Content>
              <View style={styles.previewHeader}>
                <MaterialCommunityIcons name="eye" size={20} color="#666" />
                <Text style={styles.previewTitle}>Pré-visualização</Text>
              </View>
              
              {title && (
                <Title style={styles.previewPostTitle} numberOfLines={2}>
                  {title}
                </Title>
              )}
              
              {description && (
                <Text style={styles.previewDescription} numberOfLines={3}>
                  {description}
                </Text>
              )}
              
              {tags.length > 0 && (
                <View style={styles.previewTags}>
                  {tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} style={styles.previewTag} compact>
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  contentInput: {
    marginBottom: 16,
    minHeight: 200,
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  counter: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  previewCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    backgroundColor: '#f9f9f9',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  previewPostTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewTag: {
    marginRight: 8,
    marginBottom: 4,
  },
});

export default CreatePostScreen;