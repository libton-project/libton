import <%= umdName %> from './index';

describe('<%= umdName %>', () => {
  it('should return <%= filename %>', () => {
    expect(<%= umdName %>()).toBe('<%= filename %>');
  });
});
