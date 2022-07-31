// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import { Head, useData } from "aleph/react";
import React, { useState, useMemo, useEffect } from 'react';
import { Header, Container, Grid, Label, Button, Input, Dimmer, Loader } from "https://esm.sh/semantic-ui-react";
import { RobotBuff, RobotBuffSupplyer } from "../../buffer/robot_buff.ts";
import { useDI } from "../../di/useDI.tsx";
import { RobotPageState } from "../../hooks/useRobotReducer.ts";


export default function Robo() {
  const robotBuff = useDI<RobotBuff>(RobotBuffSupplyer);
  console.log("ふがふが robot page 作ったナリ ");
  console.log(robotBuff.nextWordInput);
  console.log(robotBuff.previousWord);

  // strictモードのせいでuseEffectが二回呼ばれてるので本番モードで実行すること
  useEffect(() => {
      console.log("ふがふが use effect");
      robotBuff.toMyTurn();
  },[1]);

  useEffect(() => {
    if(robotBuff.pageState == RobotPageState.ROBOTTURN) {
      console.log("ふがふが use effect to robot turn");
      robotBuff.robotTurn();
    }
  },[robotBuff.pageState]);

  console.log("ふがふが previous word: ");
  console.log(robotBuff.previousWord);

  console.log(robotBuff.pageState);
  switch(robotBuff.pageState) {
    case RobotPageState.LOADING: return (
      <Container><Dimmer active inverted>
        <Loader>準備中．．．</Loader>
      </Dimmer></Container>
    );

    case RobotPageState.LOSE: return (
      <Container textAlign="center">
        <Header size="huge">キミは勝てるか！！</Header>
        <Header size="huge">最強しりとりロボ</Header>

        <h1>あなたの負け！！</h1>
      </Container>
    );

    case RobotPageState.WIN: return (
      <Container textAlign="center">
        <Header size="huge">キミは勝てるか！！</Header>
        <Header size="huge">最強しりとりロボ</Header>

        <h1>参りました．．．</h1>
      </Container>
    );

    case RobotPageState.ROBOTTURN: return (
      <Container textAlign="center">
        <Header size="huge">キミは勝てるか！！</Header>
        <Header size="huge">最強しりとりロボ</Header>

        <Header as="h2">ロボの番</Header>
        <p id="previousWord">前の単語:{robotBuff.previousWord}</p>
        <Container><Dimmer active inverted>
          <Loader>考え中．．．</Loader>
        </Dimmer></Container>
      </Container>
    );

    case RobotPageState.MYTURN: return (
  // from  https://illustimage.com/?dl=5380
    <Container as="article" className="robo" direction="column" gap={2} p="4" borderWidth="1px" borderRadius="lg" align="center">
      <Header size="huge">キミは勝てるか！！</Header>
      <Header size="huge">最強しりとりロボ</Header>

      <Grid columns={2}><Grid.Row verticalAlign="middle">
        <Grid.Column width={8} textAlign="right">
          <Header as="h2">あなたの番</Header>
        </Grid.Column>
        <Grid.Column width={8} textAlign="left">
          <Header as="h3">前の単語:{robotBuff.previousWord}</Header>
        </Grid.Column>
      </Grid.Row></Grid>

      <Grid columns={2}><Grid.Row verticalAlign="middle">
        <Grid.Column width={8} textAlign="right">
          <Input size="huge" placeholder="次の単語を入力" type="text" value={robotBuff.nextWordInput} onChange={(event) => {
              console.log(event.target.value);
              robotBuff.NextWord = event.target.value;
            }}/>
        </Grid.Column>
        <Grid.Column width={8} textAlign="left">
          <Button onClick={() => {
            robotBuff.submission();
          }}>送信</Button>
        </Grid.Column>
      </Grid.Row></Grid>
    </Container>
    );
    default: return (
      <h1>Error 乙</h1>
    );
  }
  /*
  return (
    <Flex as="article" direction="column" gap={2} p="4" borderWidth="1px" borderRadius="lg" align="center">
      <Heading as="h1" size="lg">
        {'Robo Fight'}
      </Heading>
      <Flex direction="column" gap={2}>
        <HStack spacing={2}>
          <Text fontSize="sm">{"2022年7月23日"}</Text>
          <Badge colorScheme="blue" borderRadius="full">
            {'kome'}
          </Badge>
        </HStack>
        <Text>{'chome'}</Text>
        <HStack spacing={2}>
          {"hogehoge"}
        </HStack>
      </Flex>
    </Flex>
  )
  */
}
