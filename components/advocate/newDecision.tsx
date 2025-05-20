import { StyleSheet, Text, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '../ThemedView';
import Checkbox from 'expo-checkbox';
import { addDecision, editDecision, deleteDecision, Decision } from '@/database/decisionsQueries';
import { getPersonWeights, personWeight } from '@/database/personWeightsQueries';
import { getGroupWeights, groupWeight } from '@/database/groupWeightsQueries';
import { getSocialWeights, socialWeight } from '@/database/socialWeightsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { MotiView } from 'moti';
import { eventBus } from '@/components/advocate/eventBus';

type Props = {
  item?: Decision
};

const newDecision = ({ item }: Props) => {
  const db = useSQLiteContext();
  const [personWeights, setPersonWeights] = useState<personWeight[]>([]);
  useEffect(() => {
    getPersonWeights(db).then(setPersonWeights).catch(console.error)
  }, [db])
  const [groupWeights, setGroupWeights] = useState<groupWeight[]>([]);
  useEffect(() => {
    getGroupWeights(db).then(setGroupWeights).catch(console.error)
  }, [db])
  const [socialWeights, setSocialWeights] = useState<socialWeight[]>([]);
  useEffect(() => {
    getSocialWeights(db).then(setSocialWeights).catch(console.error)
  }, [db])

  const [content, onChangeContent] = useState(item?.content ?? '');
  const [title, onChangeTitle] = useState(item?.title ?? '');

  const [personPercentage, onChangePersonPercentage] = useState(0);
  const [groupPercentage, onChangeGroupPercentage] = useState(0);
  const [socialPercentage, onChangeSocialPercentage] = useState(0);

  const [isPersonChecked, setPersonChecked] = useState<boolean[]>([]);
  const [isGroupChecked, setGroupChecked] = useState<boolean[]>([]);
  const [isSocialChecked, setSocialChecked] = useState<boolean[]>([]);

  const [isPass, setPass] = useState(false);
  useEffect(() => {
    if (Math.round(personPercentage * 100) >= 80 && Math.round(groupPercentage * 100) >= 80 && Math.round(socialPercentage * 100) >= 80) {
      setPass(true);
    }
  })

  function addingDecisions(title: string, content: string) {
    addDecision(db, title, content)
      .then(result => {
        console.log("A Decision is added successfully:", result);
        eventBus.emit('dbDecisionsChange');
      }).catch(console.error);
  }

  function editingDecisions(title: string, content: string, id: number) {
    editDecision(db, title, content, id)
      .then(result => {
        console.log("A Decision is edited successfully:", result);
        eventBus.emit('dbDecisionsChange');
      })
      .catch(console.error);
  }

  function deletingDecisions(id: number) {
    deleteDecision(db, id)
      .then(result => {
        console.log("A Decision is deleted successfully:", result);
        eventBus.emit('dbDecisionsChange');
      })
      .catch(console.error);
  }

  const [buttonPressed, setButtonPress] = useState(false);
  const [deletePressed, setDeletePress] = useState(false);

  return (
    <ThemedView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTitle}
        value={title}
        placeholder="标题"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeContent}
        value={content}
        placeholder="决定内容"
      />
      <Pressable
        style={{
          marginTop: 10
        }}
        onPress={() => {
          setDeletePress(!deletePressed)
        }}
      >
        <MotiView
          animate={{ backgroundColor: deletePressed ? '#db0000' : '#fcba03' }}
          style={{
            borderRadius: 14,
            justifyContent: 'center',
            width: '40%',
            height: 40,
            alignSelf: 'center',
          }}>
          <ThemedText style={{
            color: 'white',
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 20
          }}>{'删除'}</ThemedText>
        </MotiView>
      </Pressable>
      <ThemedText type="subtitle" style={{ paddingLeft: 10 }}>{'\n个人'}</ThemedText>
      <ThemedView style={{ paddingLeft: 10 }}>
        {personWeights.map(item => (
          <React.Fragment key={item.id}>
            <ThemedView key={item.id} style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={isPersonChecked[item.id]}
                onValueChange={(value) => {
                  setPersonChecked((prev) => {
                    const updated = [...prev];
                    updated[item.id] = value;
                    return updated;
                  });
                  onChangePersonPercentage(value ? (personPercentage + item.weight) : (personPercentage - item.weight));
                }}
                color={isPersonChecked ? '#fcba03' : undefined}
              />
              <ThemedText key={item.id}>{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
            </ThemedView>
          </React.Fragment>
        ))}
        <ThemedText style={styles.accept}> {'支持率'} </ThemedText>
        <ThemedText style={styles.percent}> {Math.round(personPercentage * 100)}% </ThemedText>
      </ThemedView>
      <ThemedText type="subtitle" style={{ paddingLeft: 10 }}>{'\n家庭与社区'}</ThemedText>
      <ThemedView style={{ paddingLeft: 10 }}>
        {groupWeights.map(item => (
          <React.Fragment key={item.id}>
            <ThemedView key={item.id} style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={isGroupChecked[item.id]}
                onValueChange={(value) => {
                  setGroupChecked((prev) => {
                    const updated = [...prev];
                    updated[item.id] = value;
                    return updated;
                  });
                  onChangeGroupPercentage(value ? (groupPercentage + item.weight) : (groupPercentage - item.weight));
                }}
                color={isGroupChecked ? '#fcba03' : undefined}
              />
              <ThemedText key={item.id}>{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
            </ThemedView>
          </React.Fragment>
        ))}
        <ThemedText style={styles.accept}> {'支持率'} </ThemedText>
        <ThemedText style={styles.percent}> {Math.round(groupPercentage * 100)}{'%'} </ThemedText>
      </ThemedView>
      <ThemedText type="subtitle" style={{ paddingLeft: 10 }}>{'\n人际'}</ThemedText>
      <ThemedView style={{ paddingLeft: 10 }}>
        {socialWeights.map(item => (
          <React.Fragment key={item.id}>
            <ThemedView key={item.id} style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={isSocialChecked[item.id]}
                onValueChange={(value) => {
                  setSocialChecked((prev) => {
                    const updated = [...prev];
                    updated[item.id] = value;
                    return updated;
                  });
                  onChangeSocialPercentage(value ? (socialPercentage + item.weight) : (socialPercentage - item.weight));
                }}
                color={isSocialChecked ? '#fcba03' : undefined}
              />
              <ThemedText key={item.id}>{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
            </ThemedView>
          </React.Fragment>
        ))}
        <ThemedText style={styles.accept}> {'支持率'} </ThemedText>
        <ThemedText style={styles.percent}> {Math.round(socialPercentage * 100)}{'%'} </ThemedText>
      </ThemedView>
      <Pressable
        style={{
          marginBottom: 250,
          marginTop: 20
        }}
        onPressIn={() => setButtonPress(true)}
        onPressOut={() => setButtonPress(false)}
        onPress={() => {
          item ? (deletePressed ? deletingDecisions(item.id) : editingDecisions(title, content, item.id)) : addingDecisions(title, content)
          eventBus.emit('changeSheet');
        }}
      >
        <MotiView
          animate={{ backgroundColor: isPass ? '#fcba03' : '#ccc' }}
          style={{
            backgroundColor: isPass ? (buttonPressed ? '#e6aa02' : '#fcba03') : '#ccc',
            borderRadius: 14,
            justifyContent: 'center',
            width: '40%',
            height: 40,
            alignSelf: 'center',
            marginBottom: 15,
          }}>
          <ThemedText style={{
            color: 'white',
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 20
          }}>{'通过'}</ThemedText>
        </MotiView>
      </Pressable>
    </ThemedView>
  )
}

export default newDecision

const styles = StyleSheet.create({
  input: {
    height: 45,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    borderColor: '#fcba03',
    fontSize: 16
  },
  accept: {
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkbox: {
    margin: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percent: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})