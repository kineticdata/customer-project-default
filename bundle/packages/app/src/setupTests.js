import 'babel-polyfill';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as matchers from 'jest-immutable-matchers';

configure({ adapter: new Adapter() });

global.bundle = {
  apiLocation: () => '/acme/app/api/v1',
  spaceLocation: () => '/acme',
  kappSlug: () => 'queue',
};

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

beforeEach(() => expect.extend(matchers));
