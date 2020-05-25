import * as React from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

interface HomeStates {
}

interface HomeProps {
}

// ============================================
// =                PC Page
// ============================================

@autobind
@connect(((state, props)=>{
}))
export class PCHome extends React.Component {

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

// ============================================
// =                Mobile Page
// ============================================

@autobind
@connect(((state, props)=>{
}))
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
const HomePageHeading = ({mobile}) => {
    <Container text>
        <Header
            as='h1' 
        ></Header>
    </Container>
}

const Menu = () => {

}
