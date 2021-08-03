import {Story} from '@storybook/react';
import ViewerHeader from "../components/ViewerHeader";
import 'index.css'

export default {
  title: 'Example/ViewerHeader',
  component: ViewerHeader
}

const Template: Story = () => {
  return (
    <ViewerHeader/>
  );
}

export const Default = Template.bind({});