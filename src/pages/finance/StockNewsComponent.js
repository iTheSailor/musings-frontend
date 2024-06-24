import React from 'react';
import { Card, Grid, Header, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StockNews = ({ news }) => (
    <>
        {news.map((article, i) => {
            const imageUrl = article.thumbnail && article.thumbnail.resolutions && article.thumbnail.resolutions.length > 0
                ? article.thumbnail.resolutions[0].url
                : null;

            return (
                <Card key={i} fluid>
                    <Card.Content>
                        <Grid columns={2}>
                            <Grid.Column verticalAlign='middle' width={10}>
                                <a href={article.link}>
                                    <Header as='h2'>
                                        {article.title}
                                    </Header>
                                </a>
                                <br />
                                <p>
                                    <em>{article.publisher}</em>
                                </p>
                                <br />
                                <p>
                                    Related Tickers: 
                                    {article.relatedTickers.map((ticker, index) => (
                                        <span key={index}>
                                            <a href={`/apps/finance/stock/${ticker}`}>{ticker}</a>
                                            {index < article.relatedTickers.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={6}>
                                {imageUrl && <Image bordered size='medium' src={imageUrl} alt={article.title} />}
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                </Card>
            );
        })}
    </>
);

StockNews.propTypes = {
    news: PropTypes.array.isRequired,
};
export default StockNews;
