import 'babel-polyfill';
import * as matchers from 'jest-immutable-matchers';

global.bundle = {
  apiLocation: () => '/acme/app/api/v1',
  spaceLocation: () => '/acme',
  kappSlug: () => 'queue',
};

beforeEach(() => expect.extend(matchers));
