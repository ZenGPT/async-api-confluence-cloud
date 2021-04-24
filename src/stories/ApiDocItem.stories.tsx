import React from 'react';
import {Story} from "@storybook/react";
import PureApiDocItem from "../components/PureApiDocItem";
import 'index.css'
export default {
  title: 'Example/ApiDocItem',
  component: PureApiDocItem
}

const Template: Story = () => {
  return (
    <section className="text-gray-500 antialiased bg-white js-focus-visible px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        <li>
          <PureApiDocItem id="1234" link="https://link.com" title="A title"/>
        </li>
      </ul>
    </section>
  )
}

export const Default = Template.bind({});
export const Hovered = Template.bind({});
Hovered.parameters = {
  pseudo: { hover: true }
}