import ArticleModel from '../../../../03-back-end/src/components/article/model';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import ArticleService from '../../services/ArticleService';
import * as path from 'path-browserify';
import { Link } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import { AppConfiguration } from '../../config/app.config';
import './ArticlePage.sass'

class ArticlePageProperties extends BasePageProperties {
    match?: {
        params: {
            aid: string;
        }
    }
}

class ArticlePageState {
    data: ArticleModel|null = null;
}

export default class ArticlePage extends BasePage<ArticlePageProperties> {
    state: ArticlePageState;

    constructor(props: ArticlePageProperties) {
        super(props);

        this.state = {
            data: null,
        }
    }

    private getArticleId(): number {
        return Number(this.props.match?.params.aid);
    }

    private getArticleData() {
        ArticleService.getArticleById(this.getArticleId())
        .then(res => {
            this.setState({
                data: res
            });
        })
    }

    componentDidMount() {
        this.getArticleData();
    }

    componentDidUpdate(oldProps: ArticlePageProperties) {
        if(oldProps.match?.params.aid !== this.props.match?.params.aid) {
            this.getArticleData();
        }
    }

    getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    renderMain(): JSX.Element {
        if(this.state.data === null) {
            return (
                <>
                    <h1>Article not found</h1>
                    <p>The article you are looking for does not exist</p>
                </>
            );
        }

        const article = this.state.data as ArticleModel;

        return (
            <>
                <h1>
                    <Link to={"/category/" + article.categoryId}>
                        &lt; Back
                    </Link> | {article.name}
                </h1>

                <Row>
                    <Col xs={12} md={8}>
                        <Card className="mb-3">
                            <Row>
                                {
                                    article.photos.map(photo => (
                                        <Col key={"article-photo-" + photo.photoId}
                                                xs={12} sm={6} md={4} lg={3} className="mt-3">
                                                <Card.Img variant="top"
                                                src= { this.getThumbPath(AppConfiguration.API_URL + "/" 
                                                + photo.imagePath) } />
                                        </Col>
                                    ))
                                }
                            </Row>

                            <Card.Body>
                                <Card.Text as="div">
                                    <Row>
                                        <Col xs={12} md={4}>
                                           <strong className="h1">
                                                &euro; {article.price.toFixed(2) }
                                           </strong>
                                        </Col>
                                    </Row>
                                </Card.Text>
                                <Card.Text as="div" className="article-page-description">
                                    {article.description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>OS</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.os}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>RAM</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.ramMemory}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Internal Storage</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.internalMemory}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Resolution</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.resolution}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Display Size</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.displaySize}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Front Camera</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.selfieCamera}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Main Camera</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.mainCamera}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Procesor</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.procesor}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Bluetooth</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.bluetooth}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Wifi</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.wifi}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Network</b> 
                                </Card.Title>
                                    <Card.Text as="div">
                                    {article.network}
                                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
} 