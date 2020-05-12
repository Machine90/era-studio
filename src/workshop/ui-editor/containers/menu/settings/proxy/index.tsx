
import * as React from 'react';
import { Accordion, Icon, Segment, Container } from 'semantic-ui-react';

interface States {
    activeIndex: number;
}


export default class ProxyBoard extends React.Component<any, States> {

    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
    }

    private renderProxyBoards = (): React.ReactNode[] => {
        const { activeIndex } = this.state;

        const boards: any[] = [
            { title: "Project server setting", board: this.projectProxyRender() },
            { title: "Material server setting", board: this.projectProxyRender() },
            { title: "Front-end setting", board: this.projectProxyRender() },
        ];

        const accordins: React.ReactNode[] = [];

        boards.forEach((board, index) => {
            accordins.push(
                <Accordion inverted>
                    <Accordion.Title
                        active={activeIndex === index}
                        index={index}
                        onClick={this.handleClick}
                    >
                        <Icon name='dropdown' />
                        {board.title}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === index}>
                        {board.board}
                    </Accordion.Content>
                </Accordion>
            );
        })

        return accordins;
    }

    private handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

    public render(): React.ReactNode {
        return (
            <Container style={{ marginTop: 'calc(5vh)' }}>
                <Segment inverted>
                    {this.renderProxyBoards()}
                </Segment>
            </Container>

        );
    }

    private projectProxyRender = () => {
        return <p>
            A dog is a type of domesticated animal. Known for its loyalty and
            faithfulness, it can be found as a welcome guest in many
            households across the world.
        </p>;
    }
}