import { forwardRef, useMemo } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

type AuthFieldProps = TextInputProps & {
  icon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
};

export const AuthField = forwardRef<TextInput, AuthFieldProps>(
  (
    {
      icon,
      containerClassName,
      inputClassName,
      placeholderTextColor,
      ...textInputProps
    },
    ref
  ) => {
    const containerClasses = useMemo(
      () =>
        `flex-row items-center h-14 rounded-[32px] bg-[#F4F6F5] dark:bg-neutral-900/80 px-5 ${
          containerClassName ?? ''
        }`,
      [containerClassName]
    );

    const inputClasses = useMemo(
      () =>
        `flex-1 text-base font-medium text-[#103B33] dark:text-white ${
          inputClassName ?? ''
        }`,
      [inputClassName]
    );

    return (
      <View className={containerClasses}>
        <TextInput
          ref={ref}
          placeholderTextColor={placeholderTextColor ?? '#8A9A93'}
          className={inputClasses}
          {...textInputProps}
        />
        {icon ? <View className="ml-3">{icon}</View> : null}
      </View>
    );
  }
);

AuthField.displayName = 'AuthField';
