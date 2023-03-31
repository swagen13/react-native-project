/* eslint-disable react/display-name */
import notifee, {
  AndroidGroupAlertBehavior,
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useHeaderHeight } from '@react-navigation/elements';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useRoute,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
// import ImagePicker from 'react-native-image-picker';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Image,
  Linking,
  LogBox,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StreamChat } from 'stream-chat';
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
  RootPath,
  RootSvg,
  Streami18n,
  Thread,
  useAttachmentPickerContext,
  useMessageInputContext,
} from 'stream-chat-expo';
import { useStreamChatTheme } from './useStreamChatTheme';

// import asnyc storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// import ImagePicker from 'react-native-image-crop-picker';

// userInfo();
// get user token and user id from userinfo function

LogBox.ignoreAllLogs(true);

const chatClient = StreamChat.getInstance('8hadcn6kjnma');
const userToken = '';
const user = {
  id: '',
};

const options = {
  state: true,
  watch: true,
};

/**
 * Start playing with streami18n instance here:
 * Please refer to description of this PR for details: https://github.com/GetStream/stream-chat-react-native/pull/150
 */
const streami18n = new Streami18n({
  language: 'en',
});

const ChannelListScreen = ({ navigation }: { navigation: any }) => {
  const route = useRoute();
  // get user id from route params
  const { userId } = route.params;

  const { setChannel } = useContext(AppContext);

  const filters = {
    members: { $in: [userId] },
  };

  const memoizedFilters = useMemo(() => filters, []);

  return (
    <Chat client={chatClient} i18nInstance={streami18n}>
      <View style={{ height: '100%' }}>
        <ChannelList
          filters={memoizedFilters}
          onSelect={(channel) => {
            console.log('====================================');
            console.log('channel', channel.id);
            console.log('====================================');
            setChannel(channel);
            navigation.navigate('Channel');
          }}
          options={options}
          sort={{
            last_message_at: -1,
          }}
        />
      </View>
    </Chat>
  );
};

const StreamButton = () => {
  const { sendMessage, text, imageUploads, fileUploads } =
    useMessageInputContext();
  const isDisabled = !text && !imageUploads.length && !fileUploads.length;
  // progress bar for image upload

  return (
    <TouchableOpacity disabled={isDisabled} onPress={sendMessage}>
      <RootSvg height={21} width={42} viewBox="0 0 42 21">
        <RootPath
          d="M26.1491984,6.42806971 L38.9522984,5.52046971 C39.7973984,5.46056971 40.3294984,6.41296971 39.8353984,7.10116971 L30.8790984,19.5763697 C30.6912984,19.8379697 30.3888984,19.9931697 30.0667984,19.9931697 L9.98229842,19.9931697 C9.66069842,19.9931697 9.35869842,19.8384697 9.17069842,19.5773697 L0.190598415,7.10216971 C-0.304701585,6.41406971 0.227398415,5.46036971 1.07319842,5.52046971 L13.8372984,6.42816971 L19.2889984,0.333269706 C19.6884984,-0.113330294 20.3884984,-0.110730294 20.7846984,0.338969706 L26.1491984,6.42806971 Z M28.8303984,18.0152734 L20.5212984,14.9099734 L20.5212984,18.0152734 L28.8303984,18.0152734 Z M19.5212984,18.0152734 L19.5212984,14.9099734 L11.2121984,18.0152734 L19.5212984,18.0152734 Z M18.5624984,14.1681697 L10.0729984,17.3371697 L3.82739842,8.65556971 L18.5624984,14.1681697 Z M21.4627984,14.1681697 L29.9522984,17.3371697 L36.1978984,8.65556971 L21.4627984,14.1681697 Z M19.5292984,13.4435697 L19.5292984,2.99476971 L12.5878984,10.8305697 L19.5292984,13.4435697 Z M20.5212984,13.4435697 L20.5212984,2.99606971 L27.4627984,10.8305697 L20.5212984,13.4435697 Z M10.5522984,10.1082697 L12.1493984,8.31366971 L4.34669842,7.75446971 L10.5522984,10.1082697 Z M29.4148984,10.1082697 L27.8178984,8.31366971 L35.6205984,7.75446971 L29.4148984,10.1082697 Z"
          pathFill={isDisabled ? 'grey' : 'blue'}
        />
      </RootSvg>
    </TouchableOpacity>
  );
};

// custom message input component
const CustomAttachButton = () => {
  const { openAttachmentPicker } = useMessageInputContext();

  return (
    <TouchableOpacity onPress={openAttachmentPicker}>
      <Image
        source={require('./assets/gallery.png')}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
};

const CustomCommandsButton = () => {
  const { openFilePicker } = useMessageInputContext();

  return (
    <TouchableOpacity onPress={openFilePicker}>
      <Image
        source={require('./assets/file.png')}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
};

const ChannelScreen = ({ navigation }: { navigation: any }) => {
  const { channel, setThread, thread } = useContext(AppContext);
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();
  const { setChannel } = useContext(AppContext);
  const route = useRoute();
  const [image, setImage] = useState('');
  const [userIdFromAsync, setUserIdFromAsync] = useState<string | null>('');
  const [progress, setProgress] = useState(0);

  const onUploadTaskEvent = async () => {
    // Update the notification with the progress of the upload task
    await notifee.displayNotification({
      id: 'upload',
      title: 'Uploading image... ' + progress + ' %',
      android: {
        channelId: 'test-channel',
        progress: {
          max: 100,
          current: progress,
          indeterminate: false,
        },
      },
    });
  };

  useEffect(() => {
    setTopInset(headerHeight);
  }, []);

  // update notification when progress changes
  useEffect(() => {
    if (progress > 0) {
      onUploadTaskEvent();
    }
  }, [progress]);

  useEffect(() => {
    let messages: any[] = [];

    // subscribe to new messages
    const unsubscribe = channel.on(
      'message.new',
      async (event: { message: any }) => {
        const user_id = await AsyncStorage.getItem('@user_id');
        setUserIdFromAsync(user_id);

        // AsyncStorage.removeItem('@messages');

        // display notification
        // if (event.message.user.id !== user_id) {
        // if (route.name !== 'Channel') {
        // get messages array from async storage
        const messagesArrayAsync = await AsyncStorage.getItem('@messages');
        if (messagesArrayAsync) {
          messages = JSON.parse(messagesArrayAsync);
        }
        // push event message to messages array
        messages.push(event.message);

        // get message array
        const messageArray = messages
          .filter((message) => message.user.id !== user_id)
          .map((message) => message.text);

        // set messages array to async storage
        AsyncStorage.setItem('@messages', JSON.stringify(messages));

        // create channel group
        const groupId = await notifee.createChannelGroup({
          id: event.message.user.id,
          name: event.message.user.id,
        });
        // remove channel
        // await notifee.deleteChannel('test-channel');

        // create channel
        const channelId = await notifee.createChannel({
          id: channel.id,
          name: channel.data.name,
          groupId,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        });

        // check if message is image
        if (event.message.attachments.length > 0) {
          const notificationId = await notifee.displayNotification({
            id: 'upload',
            title: 'Uploading image... ' + progress + ' %',
            android: {
              channelId: 'test-channel',
              progress: {
                max: 100,
                current: progress,
                indeterminate: false,
              },
            },
          });
          // display notification
          // notifee.displayNotification({
          //   id: 'upload',
          //   title: 'Messages from ' + event.message.user.name,
          //   body: event.message.attachments[0].name,
          //   subtitle: 'Uploading image...' + progress + ' %',
          //   android: {
          //     channelId,
          //     groupId,
          //     style: {
          //       type: AndroidStyle.INBOX,
          //       lines: messageArray,
          //     },
          //     smallIcon: 'ic_launcher',
          //     groupSummary: true,
          //     groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
          //     progress: {
          //       max: 10,
          //       current: 0,
          //       indeterminate: false,
          //     },
          //   },
          // });

          setProgress(20);
          // set timeout to simulate upload progress
          setTimeout(() => {
            setProgress(40);
          }, 2000);
          setTimeout(() => {
            setProgress(60);
          }, 3000);
          setTimeout(() => {
            setProgress(80);
          }, 4000);
          setTimeout(() => {
            setProgress(100);
          }, 5000);
          setTimeout(() => {
            notifee.cancelNotification(notificationId);
          }, 5500);
        } else {
          // display notification
          notifee.displayNotification({
            title: 'Messages from ' + event.message.user.name,
            body: event.message.text,
            subtitle: 'Unread ' + messageArray.length + ' message',
            android: {
              channelId,
              groupId,
              style: {
                type: AndroidStyle.INBOX,
                lines: messageArray,
              },
              smallIcon: 'ic_launcher',
              groupSummary: true,
              groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
              progress: {
                max: 10,
                current: 5,
                indeterminate: true,
              },
              sound: 'noti_sound2',
            },
          });
        }
        // }
        // }
      }
    );

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const user_id = await AsyncStorage.getItem('@user_id');
      if (type === EventType.PRESS) {
        setChannel(channel);
        // pop messages from messageArray
        let messagesClear = messages.filter(
          (message) => message.user.id === user_id
        );
        // set messages array to async storage
        AsyncStorage.setItem('@messages', JSON.stringify(messagesClear));
        navigation.navigate('Channel');
      }
    });
  }, []);

  const openImagePicker = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={headerHeight}
          thread={thread}
          // change icon for attach button
          AttachButton={CustomAttachButton}
          // AttachButton={() => (
          //   <TouchableOpacity onPress={openImagePicker}>
          //     <Image
          //       source={require('./assets/gallery.png')}
          //       style={{ width: 30, height: 30 }}
          //     />
          //   </TouchableOpacity>
          // )}
          SendButton={StreamButton}
          CommandsButton={CustomCommandsButton}
          FileAttachmentIcon={() => (
            <Image
              source={require('./assets/PDF_file.png')}
              style={{
                width: 37,
                height: 45,
              }}
            />
          )}
          // hasImagePicker={false}
          hasFilePicker={false}
          ImageLoadingIndicator={() => null}
          legacyImageViewerSwipeBehaviour={false}
          // MessageFooter={() => null}
          MessageStatus={() => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: '#9CA3AF',
                  marginRight: 5,
                }}
              >
                อ่านแล้ว
              </Text>
            </View>
          )}
        >
          <View style={{ flex: 1 }}>
            <MessageList
              onThreadSelect={(thread) => {
                setThread(thread);
                navigation.navigate('Thread');
              }}
              Message={(props) => {
                const { message } = props;
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems:
                        message.user?.id === chatClient.userID
                          ? 'flex-end'
                          : 'flex-start',
                      justifyContent:
                        message.user?.id === chatClient.userID
                          ? 'flex-end'
                          : 'flex-start',
                      backgroundColor: '#F0FEFF',
                    }}
                  >
                    {message.text === 'ข้อเสนอแนะ' && (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'white',
                          width: '80%',
                          marginRight: 40,
                          borderRadius: 10,
                          paddingBottom: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'grey',
                          }}
                        >
                          10:55 {'\n'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'green',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          ข้อเสนอของคุณ {'\n'}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            อิสระภาพ วิชัย
                          </Text>
                          ได้ว่าจ้างคุณ
                          {'\n'}
                          ทำความสะอาดบ้าน ราคา 400 บาท {'\n'} จำนวน 1 วัน
                        </Text>
                      </View>
                    )}
                    {message.user?.id === chatClient.userID &&
                      message.text !== 'ข้อเสนอแนะ' && (
                        <CustomStatus {...props} />
                      )}
                    {message.text !== 'ข้อเสนอแนะ' && (
                      <CustomMessage {...props} />
                    )}

                    {message.user?.id !== chatClient.userID &&
                      message.text !== 'ข้อเสนอแนะ' && (
                        <CustomStatus {...props} />
                      )}

                    {/* <MessageFooter formattedDate={''} {...props} /> */}
                  </View>
                );
              }}
            />
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            )}
            <MessageInput />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

const CustomStatus = (props: { message: any }) => {
  const { message } = props;
  // time for message (HH:MM) 24 hour format + 7 hours
  const time = JSON.stringify(message.created_at).slice(12, 17);

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: 2,
      }}
    >
      {message.user.id === chatClient.userID && (
        <Text
          style={{
            fontSize: 12,
            color: '#9CA3AF',
          }}
        >
          อ่านแล้ว
        </Text>
      )}
      <Text
        style={{
          fontSize: 10,
          color: '#9CA3AF',
          marginBottom: 8,
        }}
      >
        {time}
      </Text>
    </View>
  );
};

const CustomMessage = (props: { message: any }) => {
  const { message } = props;
  // background color for message
  const backgroundColor =
    message.user.id === chatClient.userID ? '#3B82F6' : '#F9FAFB';
  // text color for message
  const textColor = message.user.id === chatClient.userID ? '#fff' : '#1F2937';
  // text color for message
  const borderColor =
    message.user.id === chatClient.userID ? '#2563EB' : '#D1D5DB';

  // justify content for message
  const justifyContent =
    message.user.id === chatClient.userID ? 'flex-end' : 'flex-start';

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        borderColor,
        borderWidth: 1,
        justifyContent,
        maxWidth: '70%',
      }}
    >
      {message.attachments.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          {message.attachments[0].mime_type === 'image/png' && (
            <Image
              source={{ uri: message.attachments[0].image_url }}
              style={{
                width: 100,
                height: 100,
              }}
            />
          )}
          {message.attachments[0].mime_type === 'image/jpeg' && (
            <TouchableOpacity
              onPress={() => {
                // open Image with google image viewer
              }}
            >
              <Image
                source={{ uri: message.attachments[0].image_url }}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            </TouchableOpacity>
          )}
          {message.attachments[0].mime_type === 'application/pdf' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {message.user.id === chatClient.userID && (
                <Image
                  source={require('./assets/PDF_file.png')}
                  style={{
                    width: 37,
                    height: 45,
                  }}
                />
              )}

              <Text
                style={{
                  color: textColor,
                  fontSize: 12,
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                {message.attachments[0].title}
              </Text>
              {message.user.id !== chatClient.userID && (
                <Image
                  source={require('./assets/PDF_file.png')}
                  style={{
                    width: 37,
                    height: 45,
                  }}
                />
              )}
            </View>
          )}
        </View>
      )}
      <Text
        style={{
          color: textColor,
          fontSize: 12,
        }}
      >
        {message.text}
      </Text>
    </View>
  );
};

const ThreadScreen = () => {
  const { channel, setThread, thread } = useContext(AppContext);
  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={headerHeight}
          thread={thread}
          threadList
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <Thread onThreadDismount={() => setThread(null)} />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

const AppContext = React.createContext(
  {} as {
    channel: any;
    setChannel: (channel: any) => void;
    setThread: (thread: any) => void;
    thread: any;
  }
);

const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

const App = () => {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();
  const theme = useStreamChatTheme();

  const [channel, setChannel] = useState<any>();
  const [thread, setThread] = useState<any>();

  const [isReady, setIsReady] = useState(false);
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

  const [userId, setUserId] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<string | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       await ImagePicker.requestMediaLibraryPermissionsAsync()
  //         .then((result) => {
  //           console.log('result', result);
  //         })
  //         .catch((error) => {
  //           console.log('error', error);
  //         });

  //       // if (status !== 'granted') {
  //       //   alert('Sorry, we need camera roll permissions to make this work!');
  //       // } else {
  //       //   console.log('Permission granted');
  //       // }
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    if (userId && userTokens) {
      // Register FCM token with stream chat server.
      const registerPushToken = async () => {
        // unsubscribe any previous listener
        unsubscribeTokenRefreshListenerRef.current?.();
        const token = await messaging().getToken();
        const push_provider = 'firebase';
        const push_provider_name = 'Massaging'; // name an alias for your push provider (optional)

        // log token
        console.log('FCM token', token);
        // setFCMToken(token);

        chatClient.setLocalDevice({
          id: token,
          push_provider,
          // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
          push_provider_name,
        });
        await AsyncStorage.setItem('@current_push_token', token);

        const removeOldToken = async () => {
          const oldToken = await AsyncStorage.getItem('@current_push_token');
          if (oldToken !== null) {
            await chatClient.removeDevice(oldToken);
          }
        };

        unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(
          async (newToken: string) => {
            await Promise.all([
              removeOldToken(),
              chatClient.addDevice(
                newToken,
                push_provider,
                userId,
                push_provider_name
              ),
              AsyncStorage.setItem('@current_push_token', newToken),
            ]);
          }
        );
      };

      const init = async () => {
        await requestPermission();
        await registerPushToken();
        await chatClient.connectUser({ id: userId }, userTokens);

        setIsReady(true);
      };

      init();

      return () => {
        chatClient?.disconnectUser();
        unsubscribeTokenRefreshListenerRef.current?.();
      };
    }
  }, [userId, userTokens]);

  if (userId === null || userTokens === null) {
    let inputText = '';
    return (
      <View
        style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20, flex: 1 }}
      >
        <TextInput
          onChangeText={(text) => (inputText = text)}
          placeholder="username"
          keyboardType="email-address"
        />
        <Button
          title="Login"
          onPress={async () => {
            let token = '';
            // set text input value to async storage
            if (inputText === 'user-test-1') {
              setUserId('user-test-1');
              setUserTokens(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci10ZXN0LTEifQ.07dgD6hICmrd9Gh_GQkljt6ZaYXAojBJQ7dog09SXaM'
              );
              token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci10ZXN0LTEifQ.07dgD6hICmrd9Gh_GQkljt6ZaYXAojBJQ7dog09SXaM';
              // set user id and token to async storage
              await AsyncStorage.setItem('@user_id', 'user-test-1');
              await AsyncStorage.setItem('@user_token', token);
            } else {
              setUserId('user-test-2');
              setUserTokens(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci10ZXN0LTIifQ.k7EC7ZdZU_U4_-7SHtFEQ0IATpEqic0eoAi0l_5_rFU'
              );
              token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci10ZXN0LTIifQ.k7EC7ZdZU_U4_-7SHtFEQ0IATpEqic0eoAi0l_5_rFU';
              // set user id and token to async storage
              await AsyncStorage.setItem('@user_id', 'user-test-2');
              await AsyncStorage.setItem('@user_token', token);
            }
          }}
        />
      </View>
    );
  }

  if (!isReady) {
    return null;
  }
  return (
    <NavigationContainer
      theme={{
        colors: {
          ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme).colors,
          background: theme.colors?.white_snow || '#FCFCFC',
        },
        dark: colorScheme === 'dark',
      }}
    >
      <AppContext.Provider value={{ channel, setChannel, setThread, thread }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OverlayProvider
            bottomInset={bottom}
            i18nInstance={streami18n}
            translucentStatusBar
            value={{ style: theme }}
            OverlayReactionList={() => null}
          >
            {isReady && (
              <Stack.Navigator
                initialRouteName="ChannelList"
                screenOptions={{
                  headerTitleStyle: { alignSelf: 'center', fontWeight: 'bold' },
                }}
              >
                <Stack.Screen
                  component={ChannelScreen}
                  name="Channel"
                  options={() => ({
                    headerBackTitle: 'Back',
                    headerRight: () => <></>,
                    headerTitle: channel
                      ? channel.data
                        ? channel.data.name
                        : ''
                      : '',
                  })}
                />
                <Stack.Screen
                  component={ChannelListScreen}
                  name="ChannelList"
                  options={{ headerTitle: 'Channel List' }}
                  initialParams={{ userId }}
                />
                <Stack.Screen
                  component={ThreadScreen}
                  name="Thread"
                  options={() => ({ headerLeft: () => <></> })}
                />
                <Stack.Screen
                  component={App}
                  name="App"
                  options={() => ({ headerLeft: () => <></> })}
                />
              </Stack.Navigator>
            )}
          </OverlayProvider>
        </GestureHandlerRootView>
      </AppContext.Provider>
    </NavigationContainer>
  );
};

export default () => {
  const theme = useStreamChatTheme();
  return (
    <SafeAreaProvider
      style={{ backgroundColor: theme.colors?.white_snow || '#FCFCFC' }}
    >
      <App />
    </SafeAreaProvider>
  );
};

function setImageUpload(arg0: (prevState: any) => any[]) {
  throw new Error('Function not implemented.');
}

function uuidv4() {
  throw new Error('Function not implemented.');
}
function onUploadTaskEvent(arg0: (event: any, upload: any) => Promise<void>) {
  throw new Error('Function not implemented.');
}
