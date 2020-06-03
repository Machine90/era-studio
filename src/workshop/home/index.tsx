import * as React from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Container, Header, Responsive, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Payload } from '@/store/common/Types';
import I18nSelector from '@/common/components/I18nSelector';
import intl from 'react-intl-universal';

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = (): number => {
    const isSSR = typeof window === 'undefined';
    const width = isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
    return width ? parseInt(width.toString()) : window.innerWidth;
}

const PageHeader = ({ mobile }) => (
    <Container text>
        <Header
            as='h1'
            content='Imagine-a-Company'
            inverted
            style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: mobile ? '1.5em' : '3em',
            }}
        />
        <Header
            as='h2'
            content='Do whatever you want when you want to.'
            inverted
            style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1.5em',
            }}
        />
        <Button primary size='huge'>
            {intl.get("home.get_start")}
            <Icon name='arrow right' />
        </Button>
        <I18nSelector></I18nSelector>
    </Container>
);
PageHeader.propTypes = {
    mobile: PropTypes.bool,
}

interface HomeStates {
}

interface HomeProps {
}

// ============================================
// =                PC Page
// ============================================

@connect((state: Payload) => ({events: state.events}))
@autobind
export class PCHome extends React.Component<any, any> {

    constructor(props) {
        super(props);
    }

    /**
     * componentDidMount
     */
    public componentDidMount() {
    }

    public render(): React.ReactNode {
        return (
            <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
                <PageHeader></PageHeader>
            </Responsive>
        );
    }
}

// ============================================
// =                Mobile Page
// ============================================

class MobileHome extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * componentDidMount
     */
    public componentDidMount() {

    }

    public render(): React.ReactNode {
        return (
            <div>
                Home screen
            </div>
        );
    }
}

/**
 * Fragments
 * - HomePageHeader
 */
const HomePageHeading = ({ mobile }) => {
    <Container text>
        <Header
            as='h1'
        ></Header>
    </Container>
}

const Menu = () => {
}
