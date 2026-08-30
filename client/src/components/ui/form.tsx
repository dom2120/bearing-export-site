import * as React from 'react';
import { cn } from '@/utils/cn';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  type UseFormReturn,
  type FieldValues,
  type Path,
} from 'react-hook-form';

type FormProps<TFieldValues extends FieldValues> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  children: React.ReactNode;
  form: UseFormReturn<TFieldValues>;
  onSubmit?: (values: TFieldValues) => void;
};

function FormInner<TFieldValues extends FieldValues>(
  { children, form, onSubmit, className, ...props }: FormProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}
        className={cn('space-y-6', className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

const FormComponent = React.forwardRef(FormInner) as <TFieldValues extends FieldValues>(
  props: FormProps<TFieldValues> & { ref?: React.ForwardedRef<HTMLFormElement> },
) => React.ReactElement | null;

export { FormComponent as Form, useForm };

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormFieldContext() {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) throw new Error('FormField components must be used within <FormField>');
  return ctx;
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  control?: any;
  render: (props: {
    field: any;
    fieldState: any;
    formState: any;
  }) => React.ReactNode;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  render,
}: FormFieldProps<TFieldValues>) {
  const methods = useFormContext<TFieldValues>();
  const actualControl = control || methods.control;

  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name}
        control={actualControl}
        render={({ field, fieldState, formState }) =>
          render({ field, fieldState, formState }) as React.ReactElement
        }
      />
    </FormFieldContext.Provider>
  );
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormItem({ className, ...props }: FormItemProps) {
  return (
    <div className={cn('space-y-2', className)} {...props} />
  );
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function FormLabel({ className, ...props }: FormLabelProps) {
  const { name } = useFormFieldContext();
  const { formState } = useFormContext();
  const error = formState.errors?.[name];

  return (
    <label
      htmlFor={name}
      className={cn(
        'text-sm font-medium text-foreground',
        error && 'text-destructive',
        className,
      )}
      {...props}
    />
  );
}

export interface FormControlProps {
  children: React.ReactElement;
}

export function FormControl({ children }: FormControlProps) {
  const { name } = useFormFieldContext();
  if (!React.isValidElement(children)) return children;

  const child = children as React.ReactElement<{
    id?: string;
    name?: string;
  }>;

  return React.cloneElement(child, {
    id: child.props.id || name,
    name: child.props.name || name,
  });
}

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormMessage({ className, children, ...props }: FormMessageProps) {
  const { name } = useFormFieldContext();
  const { formState } = useFormContext();
  const error = formState.errors?.[name];
  const message = error?.message as string | undefined;

  if (!message && !children) return null;

  return (
    <p className={cn('text-sm font-medium text-destructive', className)} {...props}>
      {message || children}
    </p>
  );
}
