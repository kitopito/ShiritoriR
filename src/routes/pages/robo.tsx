// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import { Head, useData } from "aleph/react";
import React, { useState, useMemo, useEffect } from 'react';
import { Header, Container, Grid, Label, Button, Input, Dimmer, Loader, Segment, Divider } from "https://esm.sh/semantic-ui-react";
import { RobotBuff, RobotBuffSupplyer } from "../../buffer/robot_buff.ts";
import { useDI } from "../../di/useDI.tsx";
import { RobotPageState } from "../../hooks/useRobotReducer.ts";

let containerHeight = 260;

export default function Robo() {

  const robotBuff = useDI<RobotBuff>(RobotBuffSupplyer);
  console.log("ふがふが robot page 作ったナリ ");
  console.log(robotBuff.nextWordInput);
  console.log(robotBuff.previousWord);

  // strictモードのせいでuseEffectが二回呼ばれてるので本番モードで実行すること
  /*
  useEffect(() => {
    // document治外法権 useEffectの中でだけdocument.bodyを取得することが可能
    document.body.className = "robo";
  });
  */
  useEffect(() => {
    containerHeight = document.body.clientHeight * 0.3;
  });
  useEffect(() => {
      console.log("ふがふが use effect");
      const width = document.body.clientWidth;
      console.log(width);
      // document治外法権 useEffectの中でだけdocument.bodyを取得することが可能
      document.body.className = "robo";
      // ページを離れるときにbodyのクラスをもどす
      window.onbeforeunload = (event) => {
        document.body.className = "";
      }

      robotBuff.setFirstWord();
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
        <Container style={{height:containerHeight,}}></Container>
        <Header size="huge">キミは勝てるか！！</Header>
        <Header size="huge">最強しりとりロボ</Header>

        <Header size="huge">あなたの負け！！</Header>
        <Header as="h2">最期の言葉: {robotBuff.previousWord}</Header>
      </Container>
    );

    case RobotPageState.WIN: return (
      <Container textAlign="center">
        <Container style={{height:containerHeight,}}></Container>
        <Header size="huge">キミは勝てるか！！</Header>
        <Header size="huge">最強しりとりロボ</Header>

        <Header size="huge">参りました．．．</Header>
        <Header as="h2">最後の言葉: {robotBuff.previousWord}</Header>
      </Container>
    );

    case RobotPageState.ROBOTTURN: return (
      <Container textAlign="center">
        <Container style={{height:containerHeight,}}></Container>
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
    <Container as="article" direction="column" gap={2} p="4" borderWidth="1px" borderRadius="lg" align="center">
      <Container style={{height:containerHeight,}}></Container>
      <Header size="huge">キミは勝てるか！！</Header>
      <Header size="huge">最強しりとりロボ</Header>
      
      <Container className="robo" >
      </Container>

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
          <Button color="green" onClick={() => {
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
