# @bigfootds/react-gamepad-utils

A base piece of a larger, ElectronJS + ReactJS game "engine" tech stack. Built for BigfootDS' specific needs, intended to be used by other packages or components.

## Hey!

This package does not currently do much, and should not be considered "stable". I'm literally only making it public right now because I want to make sure I can compile and publish to NPM properly. Hang tight for stability!

## Installation

Install this package from NPM with this command:

```bash
npm i @bigfootds/react-gamepad-utils
```

## Package Goals

This package provides a configurable input polling loop, and some helper methods to serialize gamepad input data.

It is a _base_ package - other packages should be made to use its functionality in more-complex or more-thorough ways.

Keep in mind that this area of browser-based JavaScript functionality is somehow both barely-touched and one spec decision away from major breaking issues. Keep an eye on the MDN web docs for Gamepad functionality and updates, and raise issues here if I've missed something!

## Package Anti-Goals

This package will not cover the features listed here, as those will instead be covered by other packages that depend on this one instead.

- UI navigation trees.
  - That system depends on the outputs of this one!
  - If you've used Unity, it's the UI navigation stuff that you can configure that determines which UI element is highlighted/focused when you press a directional/arrow/movement input. The yellow connectors in [the documentation here](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-SelectableNavigation.html), essentially.
- Gamepad controller maps.
  - That system depends on the outputs of this one!
  - Realistically, controller maps should be a design problem that you, the game developer, solves. How are they persisted? What is default? What controllers do you support? What UI do you use to remap? What UX should be in place to remap? Games should strive to have remappable controller layouts [as per industry standards](https://gameaccessibilityguidelines.com/allow-controls-to-be-remapped-reconfigured/), but figuring out answers to those questions specifically for your game is up to you!
- Gamepad-controlled DOM elements.
  - This is kinda in the same boat as controller mapping and UI navigation trees - depends on output of this, and additionally is going to be very specific to your game.

## Package Exports

- Contexts
  - `GamepadContext`: Context reference for the rest of the things in this library. Its values are determined by the logic in the `GamepadBaseProvider` - it should be an object containing properties and functions.
- Components
  - `GamepadBaseProvider`: Initializes and provide the `GamepadContext`, as well as various functions and variables to configure the input polling loop. 
- Hooks
  - `useGamepadContext`: Just returns the `GamepadContext` as-is.
- Utilities
  - Gamepad Data helper functions:
    - `getGamepadsData()`: An error-safe function that attempts to retrieve gamepad data from the browser's navigator system. Will catch errors and return an empty array if no data can be retrieved, logging a warning when that happens.
    - `serializeGamepads()`: Returns a large object of data, which is all essentially just a processed and serializable snapshot of the unserializable snapshot returned by `getGamepadsData()`. 

## Considerations

- "Where's the backwards compatible XYZ? Where's the conditional check for the gamepad system and webkit fallback?"
  - This library is built for BigfootDS' needs, and we are using ElectronJS. ElectronJS bundles in an extremely modern Chromium. If you're not using a recent version of ElectronJS, you should update!

## TODO

- Actual control over the polling loop
  - need better logic over requesting and cancelling animation frames, the latestFrameId doesn't give us much functionality
- Confirm the other gamepad serialized data - buttons work, but what about axes? Can we name buttons?

## Usage

Given that this repo is in very early development, don't expect this to be accurate for long... but... here:

```jsx
import { useEffect } from 'react';
import './App.css'
import { useGamepadContext } from '@bigfootds/react-gamepad-utils';

function App() {
  let {gamepads, setShouldBePolling} = useGamepadContext();

  useEffect(() => {
    setShouldBePolling(true)
  }, [setShouldBePolling]);

  useEffect(() => {
    console.log("Gamepad data updated.");
  }, [gamepads]);

  if (gamepads.some(entry => entry)){
    return <>
     <h1>Found {gamepads.reduce((total, gamepad) => {
      return gamepad ? total + 1 : total;
     }, 0)} devices.</h1>
     {gamepads.map((data, index) => {
      return <div key={data.id + "-" + index + "-" + data.index}>
        <h2>{data.id}</h2>
        {data.buttons.map((button, buttonIndex) => <div key={buttonIndex}>
        <h3>Button {buttonIndex}: {button.pressed ? "Pressed" : "Not Pressed"}</h3>
        <h3>Button {buttonIndex}: {button.touched ? "Touched" : "Not Touched"}</h3>
        <h3>Button {buttonIndex}: {button.value}</h3>
        </div>)}
      </div>
     })}
    </>
  } else {
    return <>
    <h1>No devices available.</h1>
    </>
  }
}

export default App
```

## Device Confirmation List

This is a list of physical game controllers that have been confirmed to work with this package.

- Xbox Elite Wireless Controller Series 2 