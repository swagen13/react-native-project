import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Channel as ChannelType, StreamChat } from 'stream-chat';
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  MessageType,
  OverlayProvider,
  Thread,
} from 'stream-chat-react-native';

const client = StreamChat.getInstance('8hadcn6kjnma');

export const App = () => {
  const [channel, setChannel] = useState<ChannelType>();
  const [clientReady, setClientReady] = useState(false);
  const [thread, setThread] = useState<MessageType | null>();

  useEffect(() => {
    const setupClient = async () => {
      try {
        await client.connectUser(
          {
            id: 'user-test-1',
            name: 'user-test-1',
            image: 'https://i.imgur.com/fR9Jz14.png',
          },
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci10ZXN0LTEifQ.07dgD6hICmrd9Gh_GQkljt6ZaYXAojBJQ7dog09SXaM'
        );
        setClientReady(true);
      } catch (e) {
        console.log(e);
      }
    };

    setupClient();
  }, []);

  const onBackPress = () => {
    if (thread) {
      setThread(undefined);
    } else if (channel) {
      setChannel(undefined);
    }
  };

  if (!clientReady) return null;

  return (
    <OverlayProvider topInset={60}>
      <TouchableOpacity onPress={onBackPress} disabled={!channel}>
        <View style={{ height: 60, paddingLeft: 16, paddingTop: 40 }}>
          {channel && <Text>Back</Text>}
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Chat client={client}>
          {channel ? (
            <Channel
              channel={channel}
              keyboardVerticalOffset={60}
              thread={thread}
              threadList={!!thread}
            >
              {thread ? (
                <Thread />
              ) : (
                <>
                  <MessageList onThreadSelect={setThread} />
                  <MessageInput />
                </>
              )}
            </Channel>
          ) : (
            <ChannelList
              onSelect={setChannel}
              filters={{ type: 'messaging', members: { $in: ['user-test-1'] } }}
            />
          )}
        </Chat>
      </View>
    </OverlayProvider>
  );
};
