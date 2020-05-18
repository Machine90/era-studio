
import * as React from 'react';
import { Describe } from '@/core/vendor/protocol';

const description: Describe = {
    app: 'official',
    name: 'enemy',
    description: 'The enemy of a game with base AI',
    thumbnail: '',
    category: 'game',
    tag: 'Enemy',
    rect: { width: '50px', height: '50px', draggable: false }
}

class Enemy extends React.Component {
    
}

export default {description, Enemy}