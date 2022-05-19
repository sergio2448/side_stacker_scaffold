interface Props {
  hello: string;
}

export const Component2 = (props: Props) => {
  return <div>Hello {props.hello}</div>;
};
