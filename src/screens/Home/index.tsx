import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import { Menu, MenuTypeProps } from '../../components/Menu';
import { Skill } from '../../components/Skill';
import { Button } from '../../components/Button';

import { Container, Title, Input, Form, FormTitle } from './styles';
import { database } from '../../databases';
import { SkillModel } from '../../databases/models/skillModel';
import { Q } from '@nozbe/watermelondb';

export function Home() {
  const [type, setType] = useState<MenuTypeProps>("soft");
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<SkillModel[]>();
  const [skill, setSkill] = useState<SkillModel>({} as SkillModel);
  const bottomSheetRef = useRef<BottomSheet>(null);

 async function handleSave() {
  try {
  if(skill.id)  {
 await database.write(async () => {
    await skill.update(data=>{
      data.name = name;
      data.type = type;      
    })
 })
  } else{
  
  await database.write(async () => {
    await database.get<SkillModel>('skills')
    .create(data =>{
      data.name = name;
      data.type = type;
    })
    
   });
   Alert.alert("Created!");

 }
 bottomSheetRef.current?.collapse();
 fetchData();
}
catch (error) {
console.log(error);    
}
 }

 async function handleRemove(item: SkillModel) {
  await database.write(async () => {
    await item.destroyPermanently();
  });
  fetchData();
  Alert.alert("Deleted!");
 }


 async function fetchData() {
  const skillCollection = database.get<SkillModel>('skills');
  const response = await skillCollection.query(
    Q.where('type', type)
  ).fetch();
  setSkills(response);
  
 }

 useEffect(() => {
   fetchData()
 }, [type]);
 

  async function handleEdit(item: SkillModel) {
    setName(item.name);
    setSkill(item);
    bottomSheetRef.current?.expand();
   
  }

  return (
    <Container>
      <Title>About me</Title>
      <Menu
        type={type}
        setType={setType}
      />

      <FlatList
        data={skills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Skill
            data={item}
            onEdit={() => { handleEdit(item) }}
            onRemove={() => handleRemove(item)}
          />
        )}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['1%', '35%']}
      >
        <Form>
          <FormTitle>New</FormTitle>

          <Input
            placeholder="New skill..."
            onChangeText={setName}
            value={name}
          />

          <Button
            title="Save"
            onPress={handleSave}
          />
        </Form>
      </BottomSheet>
    </Container>
  );
}