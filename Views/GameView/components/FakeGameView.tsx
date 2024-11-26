import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { View } from 'react-native';
import Board from './Board/Board';
import { getEmptyBoard } from './Board/utils';
import GameViewFooter from './GameViewFooter';
import GameViewHeader from './GameViewHeader';

export default function FakeGameView() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <GameViewHeader />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Board board={getEmptyBoard()} isDisabled={true} onMove={() => {}} />
      </View>
      <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <GameViewFooter />
      </View>
    </ThemedView>
  );
}
