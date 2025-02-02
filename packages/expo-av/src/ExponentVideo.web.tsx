import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import ExponentAV from './ExponentAV';

import { PlaybackNativeSource, PlaybackStatus, PlaybackStatusToSet } from './AV';

type ExponentVideoProps = {
  source: PlaybackNativeSource | null;
  resizeMode?: object;
  status?: PlaybackStatusToSet;
  useNativeControls?: boolean;
  onStatusUpdate?: (event: { nativeEvent: PlaybackStatus }) => void;
  onReadyForDisplay?: (event: { nativeEvent: object }) => void;
  onFullscreenUpdate?: (event: { nativeEvent: object }) => void;
  onLoadStart: () => void;
  onLoad: (event: { nativeEvent: PlaybackStatus }) => void;
  onError: (event: { nativeEvent: { error: string } }) => void;
  // Required by react-native
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
  rotation?: number;
} & React.ComponentProps<typeof View>;

export type NaturalSize = {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
};

export const FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT = 0;
export const FULLSCREEN_UPDATE_PLAYER_DID_PRESENT = 1;
export const FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS = 2;
export const FULLSCREEN_UPDATE_PLAYER_DID_DISMISS = 3;

export const IOS_FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT = FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT;
export const IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT = FULLSCREEN_UPDATE_PLAYER_DID_PRESENT;
export const IOS_FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS = FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS;
export const IOS_FULLSCREEN_UPDATE_PLAYER_DID_DISMISS = FULLSCREEN_UPDATE_PLAYER_DID_DISMISS;

export default class ExponentVideo extends React.Component<ExponentVideoProps> {
  _video?: HTMLVideoElement;

  componentDidMount() {
    const isIE11 = !!window['MSStream'];
    document.addEventListener(
      isIE11 ? 'MSFullscreenChange' : 'fullscreenchange',
      this.onFullscreenChange
    );
  }

  componentWillUnmount() {
    const isIE11 = !!window['MSStream'];
    document.addEventListener(
      isIE11 ? 'MSFullscreenChange' : 'fullscreenchange',
      this.onFullscreenChange
    );
  }

  onFullscreenChange = event => {
    if (!this.props.onFullscreenUpdate) return;

    if (event.target === this._video) {
      if (document.fullscreenElement) {
        this.props.onFullscreenUpdate({
          nativeEvent: { fullscreenUpdate: FULLSCREEN_UPDATE_PLAYER_DID_PRESENT },
        });
      } else {
        this.props.onFullscreenUpdate({
          nativeEvent: { fullscreenUpdate: FULLSCREEN_UPDATE_PLAYER_DID_DISMISS },
        });
      }
    }
  };

  onStatusUpdate = async () => {
    if (!this.props.onStatusUpdate) {
      return;
    }
    const nativeEvent = await ExponentAV.getStatusForVideo(this._video);
    this.props.onStatusUpdate({ nativeEvent });
  };

  onLoadStart = () => {
    if (!this.props.onLoadStart) {
      return;
    }
    this.props.onLoadStart();
    this.onStatusUpdate();
  };

  onLoadedData = event => {
    if (!this.props.onLoad) {
      return;
    }
    this.props.onLoad(event);
    this.onStatusUpdate();
  };

  onError = event => {
    if (!this.props.onError) {
      return;
    }
    this.props.onError(event);
    this.onStatusUpdate();
  };

  onProgress = () => {
    this.onStatusUpdate();
  };

  onSeeking = () => {
    this.onStatusUpdate();
  };

  onEnded = () => {
    this.onStatusUpdate();
  };

  onLoadedMetadata = () => {
    this.onStatusUpdate();
  };

  onCanPlay = event => {
    if (!this.props.onReadyForDisplay) {
      return;
    }
    this.props.onReadyForDisplay(event);
    this.onStatusUpdate();
  };

  onStalled = () => {
    this.onStatusUpdate();
  };

  onRef = (ref: HTMLVideoElement) => {
    this._video = ref;
    this.onStatusUpdate();
  };

  render() {
    const { source, status = {}, resizeMode: objectFit, useNativeControls, style } = this.props;

    const customStyle = {
      position: undefined,
      objectFit,
      overflow: 'hidden',
    } as any;
    const finalStyle = StyleSheet.flatten([style, customStyle]) as React.CSSProperties;
    return (
      <video
        ref={this.onRef}
        onLoadStart={this.onLoadStart}
        onLoadedData={this.onLoadedData}
        onError={this.onError}
        onTimeUpdate={this.onProgress}
        onSeeking={this.onSeeking}
        onEnded={this.onEnded}
        onLoadedMetadata={this.onLoadedMetadata}
        onCanPlay={this.onCanPlay}
        onStalled={this.onStalled}
        src={(source || { uri: undefined }).uri}
        muted={status.isMuted}
        loop={status.isLooping}
        autoPlay={status.shouldPlay}
        controls={useNativeControls}
        style={finalStyle}
      />
    );
  }
}
