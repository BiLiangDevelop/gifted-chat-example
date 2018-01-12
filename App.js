import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Keyboard,
    Button,
    TouchableOpacity,
    TextInput
} from 'react-native';

import {GiftedChat, Actions, Bubble, ActionsRight, IconButton} from 'react-native-gifted-chat';
import CustomView from './CustomView';
import Composer from './Composer'

export default class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
            showSlideBar: false,
        };

        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);

        this._isAlright = null;
        this.show = false;
    }

    componentWillMount() {
        this._isMounted = true;
        this.setState(() => {
            return {
                messages: require('./data/messages.js'),
            };
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });

        setTimeout(() => {
            if (this._isMounted === true) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    };
                });
            }
        }, 1000); // simulating network
    }

    onSend(messages = []) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });

        // for demo purpose
        this.answerDemo(messages);
    }

    answerDemo(messages) {
        if (messages.length > 0) {
            if ((messages[0].image || messages[0].location) || !this._isAlright) {
                this.setState((previousState) => {
                    return {
                        typingText: 'React Native is typing'
                    };
                });
            }
        }

        setTimeout(() => {
            if (this._isMounted === true) {
                if (messages.length > 0) {
                    if (messages[0].image) {
                        this.onReceive('Nice picture!');
                    } else if (messages[0].location) {
                        this.onReceive('My favorite place');
                    } else {
                        if (!this._isAlright) {
                            this._isAlright = true;
                            this.onReceive('Alright');
                        }
                    }
                }
            }

            this.setState((previousState) => {
                return {
                    typingText: null,
                };
            });
        }, 1000);
    }

    onReceive(text) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, {
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        // avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                }),
            };
        });
    }

    renderCustomActions(props) {
        return (
            <Actions
                {...props}
            />
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#f0f0f0',
                    }
                }}
            />
        );
    }

    renderCustomView(props) {
        return (
            <CustomView
                {...props}
            />
        );
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    render() {
        return (
            <GiftedChat
                ref="chat"
                messages={this.state.messages}
                onSend={this.onSend}
                loadEarlier={this.state.loadEarlier}
                onLoadEarlier={this.onLoadEarlier}
                isLoadingEarlier={this.state.isLoadingEarlier}
                renderRig
                user={{
                    _id: 1, // sent messages should have same user._id
                }}
                renderBubble={this.renderBubble}
                renderCustomView={this.renderCustomView}
                renderFooter={this.renderFooter}
                renderActionsRight={this.renderRightAction.bind(this)}
                renderCustomMenu={this.renderCustomMenu.bind(this)}
                renderHoldToTalkButton={this.renderHoldToTalk.bind(this)}
                renderAudioButton={this.renderAudioButton}
                renderKeyboardButton={this.renderKeyboardButton}
                renderClarifyStateNormal={this.renderKeyboardButton}
                renderClarifyStateInput={this.renderClarifyStateInput}
                renderComposer={this.renderComposer}
                customMenuHeight={200}
                renderSnapChatBtn={this.renderSnapChatBtn.bind(this)}
                renderSnapChatSlideBar={this.renderSnapChatSlideBar}
            />
        );
    }

    renderSnapChatSlideBar() {
        return (
            <View style={{backgroundColor: 'yellow', height: 50}}>

            </View>
        )
    }

    renderSnapChatBtn() {
        return this.renderClarifyStateInput();
    }

    renderComposer(props) {
        return (
            <Composer
                {...props}
            />
        )
    }

    renderClarifyItems() {
        return (
            <View style={[styles.clarifyContainer]}>

                <View style={styles.line}>
                    <View style={[styles.line, {flex: 1, borderLeftWidth: 0.3,}]}>
                    </View>
                </View>

                <TouchableOpacity style={styles.clarifyItem}>
                    <IconButton
                        textIcon='-'
                    />
                    <Text style={styles.clarifyText}>
                        服务
                    </Text>
                </TouchableOpacity>

                <View style={styles.line}>
                    <View style={[styles.line, {flex: 1, borderLeftWidth: 0.3,}]}>
                    </View>
                </View>

                <TouchableOpacity style={styles.clarifyItem}>
                    <IconButton
                        textIcon='-'
                    />
                    <Text style={styles.clarifyText}>
                        我的
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderHoldToTalk() {
        return (
            <Button title='按住说话' onPress={() => {
                console.log('on press')
                this.refs.chat.onShowSnapChat(!this.show);
                this.show = !this.show;
            }}/>
        )
    }

    renderAudioButton() {
        return (
            <IconButton
                textIcon=')))'
            />
        );
    }

    renderClarifyStateInput() {
        return (
            <IconButton
                textIcon='6'
            />
        );
    }

    renderKeyboardButton() {
        return (
            <IconButton
                textIcon='三'
            />
        );
    }

    renderCustomMenu(props) {
        return (
            <IconButton
                onIconClick={() => {
                    this.refs.chat.hideCustomMenu();
                }}
                textIcon='+'
            />
        );
    }

    renderRightAction(props) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.refs.chat.changeCustomMenu();
                }}
                style={{marginRight: 8}}
            >
                <IconButton
                    textIcon='+'
                />
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    clarifyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    clarifyItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    line: {
        borderLeftColor: 'rgba(0,0,0,0.8)',
    },
    clarifyText: {
        fontSize: 16,
        padding: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 16,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
        }),
    },

});
