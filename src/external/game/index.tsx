import * as React from "react";
import { Describe, StylesEditor } from '@/core/vendor/protocol';
import { Container, Image, Form, FormInput, FormButton } from 'semantic-ui-react';
import { Game } from 'react-phaser-fiber';

const describe: Describe = {
    app: "official",
    name: "Scroll Game Scene",
    alias: "横版游戏场景",
    category: "game",
    tag: "Scroll Game",
    rect: {
        width: '100%',
        height: '500px',
        draggable: false
    },
    thumbnail: "http://hbimg.b0.upaiyun.com/58fd3c74f534e0b1395ded8086b546b2b7804b4fa7bb8-vpIvvO_fw658"
}

class SimpleScene extends Phaser.Scene {

    public static groundTexture: string;
    public static rigidBody: any[] = [];

    public preload() {
        console.log("preloading resources....");
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('ground', SimpleScene.groundTexture || 'assets/tests/timer/ground.png');
    }

    public create() {
        this.add.image(0, 320, 'ground').setOrigin(0);
    }

    public update(time: number, delta: number): void {
    }
}

class GameScene extends React.Component {

    private game: React.ReactNode;
    private seq: string;

    componentDidUpdate() {
        // this.seq = `scroll-game-${new Date().getTime()}`;
        if (this.seq) this.createGame();
    }

    componentDidMount() {
        this.createGame();
    }

    private createGame = () => {
        const styles: SceneStyle = (this.props["styles"] as SceneStyle) || {};
        SimpleScene.groundTexture = styles.groundTexture;

        console.log("----> creating game", this.seq, "\n", this.props["styles"], styles, "\n", SimpleScene.groundTexture);

        this.game = <Game
            parent={this.seq}
            width={667} height={375} type={Phaser.CANVAS}
            backgroundColor='#9adaea'
            physics={{
                default: 'arcade'
            }}
            scene={SimpleScene}
        />
    }

    private processSprites = () => {

    }

    private processChilds = (children: React.ReactNode) => {

    }

    public render(): React.ReactNode {
        this.seq = this.seq ? this.seq : `scroll-game-${new Date().getTime()}`;
        if (!this.game) this.game = <Image src={describe.thumbnail}></Image>
        const children: React.ReactNode = this.props.children;
        this.processChilds(children);
        return (
            <div style={sceneStyle} id={this.seq}>
                {this.game}
            </div>
        )
    }
}

interface SceneStyle {
    background: string;
    groundTexture: string;
}

class GameSceneStyle extends StylesEditor {

    public render(): React.ReactNode {

        const styles: SceneStyle = (this.props.styles as SceneStyle) || {};
        const { updateStyles } = this.props;
        console.log("style....", styles);

        return (
            <Form>
                <FormInput
                    placeholder="background"
                    defaultValue={styles.background}
                    onChange={(e, d) => { styles.background = d.value; }}
                ></FormInput>
                <FormInput
                    placeholder="ground"
                    defaultValue={styles.groundTexture}
                    onChange={(e, d) => { styles.groundTexture = d.value; }}
                ></FormInput>

                <FormButton primary onClick={() => {
                    updateStyles({ ...styles });
                }}>Submit</FormButton>
            </Form>
        )
    }
}

const sceneStyle: any = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
    height: "375px"
};

export default { describe, GameScene, GameSceneStyle };