import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';

export class Item {
    public title: string;
    public description: string;
    public image?: string;
    public price?: string;
}

export class Detail {
    public category: string;
    public items: Item[];
}

interface SearchState {
    isLoading: boolean;
    results: any[];
    input: string;
}

interface SearchProps {
    source?: Detail[];
}

const initialState: SearchState = { isLoading: false, results: [], input: '' }
export class SearchBox extends Component<SearchProps, SearchState> {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    private handleResultSelect = (e, { result }) => this.setState({ input: result.title });

    private handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, input: value });
        const source: Detail[] = this.props.source ? this.props.source : [];
        setTimeout(() => {
            if (this.state.input.length < 1) return this.setState(initialState)

            const re = new RegExp(_.escapeRegExp(this.state.input), 'i')
            const isMatch = (item) => re.test(item.title);

            const filteredResults = _.reduce(
                source, (memo: object, data: Detail) => {
                    const results = _.filter(data.items, isMatch);
                    if (results.length) memo[data.category] = { name: data.category, results }
                    return memo
                }, {},
            );
            this.setState({
                isLoading: false,
                results: filteredResults,
            })
        }, 300)
    }

    public render() {
        return (
            <Search
                category={true}
                loading={this.state.isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                })}
                results={this.state.results}
                value={this.state.input}
                {...this.props}
            />
        )
    }
}