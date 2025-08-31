import React from 'react';
import { View, ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // For now, we'll use a simple light theme
  // You can extend this later to support dark mode
  const backgroundColor = lightColor;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}