// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import { Head, useData } from "aleph/react";
import React, { useState, useReducer, useEffect, useMemo } from 'react';
import { RandomBuff, RandomBuffSupplyer } from "../../buffer/random_buff.ts";
import { useDI } from "../../di/useDI.tsx";
import { MatchingState } from "../../hooks/useMatchingReducer.ts";
import { Button, Container, Header, Divider, Grid, Input, Dimmer, Loader } from "https://esm.sh/semantic-ui-react";

export default function Random() {
//  const [state, dispatch] = useShiritoriReducer();

//  const randomBuff = new RandomBuff();
  const randomBuff = useDI<RandomBuff>(RandomBuffSupplyer);
  console.log("ふがふが random page 作ったナリ ");
  console.log(randomBuff.nextWordInput);
  console.log(randomBuff.previousWord);

  // strictモードのせいでuseEffectが二回呼ばれてるので本番モードで実行すること
  useEffect(() => {
      console.log("ふがふが use effect");
      randomBuff.toWaitingState();

//      UIのテストのためにすぐ自分の番にする
//      randomBuff.toMyTurn();

      // ページを離れるときは必ずsupabaseをリセットする
      window.onbeforeunload = async (event) => {
        await randomBuff.resetSupabase();
      }
      history.replaceState(null, null, null);
      window.addEventListener('popstate', async (e) => {
        // これは戻るボタンが押されたときに実行される
        await randomBuff.resetSupabase();
      });
  },[1]);

  console.log("ふがふが previous word: ");
  console.log(randomBuff.previousWord);

/*
  function setNextWord(_word: string) {
    console.log("setNextWord");
    dispatch({type: 'CHANGE_VALUE', data: _word, field: 'nextWordInput'});
  }
  function setPreviousWord(_word: string) {
    console.log("setPreviousWord");
    dispatch({type: 'CHANGE_VALUE', data: _word, field: 'previousWord'});
  }
*/

  switch(randomBuff.pageState) {
    case MatchingState.MATCHING: return (
      <Container><Dimmer active inverted>
        <Loader>相手を待っています．．．</Loader>
      </Dimmer></Container>
    );

    case MatchingState.LOSE: return (
      <Container textAlign="center">
        <Header size="huge">負けた！！</Header>
        <Header as="h2">最期の言葉: {randomBuff.previousWord}</Header>
      </Container>
    );

    case MatchingState.WIN: return (
      <Container textAlign="center">
        <Header size="huge">勝った！！</Header>
        <Header as="h2">最期の言葉: {randomBuff.previousWord}</Header>
      </Container>
    );

    case MatchingState.OPPONENTTURN: return (
      <Container textAlign="center">
        <Header as="h1">ランダム対戦中です</Header>
        <Grid columns={2}><Grid.Row verticalAlign="middle">
          <Grid.Column width={8} textAlign="right">
            <Header as="h2">相手の番</Header>
          </Grid.Column>
          <Grid.Column width={8} textAlign="left">
            <Header as="h3">前の単語:{randomBuff.previousWord}</Header>
          </Grid.Column>
        </Grid.Row></Grid>
      </Container>
    );

    case MatchingState.MYTURN: return (
      <Container textAlign="center">
        <Header as="h1">ランダム対戦中です．．．</Header>
        <Grid columns={2}><Grid.Row verticalAlign="middle">
          <Grid.Column width={8} textAlign="right">
            <Header as="h2">あなたの番</Header>
          </Grid.Column>
          <Grid.Column width={8} textAlign="left">
            <Header as="h3">前の単語:{randomBuff.previousWord}</Header>
          </Grid.Column>
        </Grid.Row></Grid>
        <Grid columns={2}><Grid.Row verticalAlign="middle">
          <Grid.Column width={8} textAlign="right">
            <Input size="huge" placeholder="次の単語を入力" type="text" value={randomBuff.nextWordInput} onChange={(event) => {
                console.log(event.target.value);
                randomBuff.NextWord = event.target.value;
              }}/>
          </Grid.Column>
          <Grid.Column width={8} textAlign="left">
            <Button onClick={() => {randomBuff.submission();}}>送信</Button>
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
        {'Random Matching'}
      </Heading>
      <p id="previousWord">前の単語:{randomBuff.previousWord}</p>
      <HStack spacing={2}>
        <Input placeholder="次の単語を入力" value={randomBuff.nextWordInput} size="lg" variant="outline" onChange={(event) => {
            console.log(event.target.value);
            randomBuff.NextWord = event.target.value;
        }}></Input>
        <Button onClick={() => {randomBuff.submission();}}>
          送信
        </Button>
      </HStack>
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
