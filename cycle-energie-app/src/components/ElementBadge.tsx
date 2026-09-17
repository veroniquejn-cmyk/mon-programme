import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ElementKey, elementColor } from '../theme/colors';
import { elementIcon } from '../theme/icons';

interface Props {
  element: ElementKey;
  size?: number;
}

/** Badge circulaire représentant un élément (feu/air/terre/eau) par son
 * symbole, dans un anneau de la couleur associée — pour un rendu plus
 * visuel que du texte seul. */
export function ElementBadge({ element, size = 48 }: Props) {
  const color = elementColor[element];
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          backgroundColor: `${color}26`,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.48 }}>{elementIcon[element]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
