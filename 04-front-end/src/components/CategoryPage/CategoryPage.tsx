import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import ArticleModel from '../../../../03-back-end/src/components/article/model';
import CategoryService from '../../services/CategoryService';
import EventRegister from '../../api/EventRegister';
import ArticleService from '../../services/ArticleService';
import ArticleItem from '../Article/ArticleItem';

class CategoryPageProperties extends BasePageProperties {
    match?: {
        params: {
            cid: string;
        }
    }
}

class CategoryPageState {
    name: string = "";
    showBackButton: boolean = false;
    articles: ArticleModel[] = [];
}

export default class CategoryPage extends BasePage<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: CategoryPageProperties) {
        super(props);

        this.state = {
            name: "Loading...",
            showBackButton: false,
            articles: [],
        };
    }

    private getCategoryId(): number {
        return this.props.match?.params.cid != null ? 
               this.props.match?.params.cid as unknown as number : -1;
    }

    private getCategoryData() {
        const cId = this.getCategoryId();

        this.apiGetCategory(cId);
        this.apiGetArticles(cId);
    }

    private apiGetCategory(cId: number) {
        CategoryService.getCategoryById(cId, 'administrator')
        .then(result => {
            if (result === null) {
                return this.setState({
                    name: "Category not found",
                    //subcategories: [],
                    showBackButton: true,
                   // parentCategoryId: null,
                });
            }

            this.setState({
                name: result.name,
                showBackButton: true,
            });
        });
    }

    private apiGetArticles(cId: number) {
        ArticleService.getArticlesByCategoryId(cId)
        .then(result => {
            this.setState({
                articles: result,
            });
        });
    }

    componentDidMount() {
        this.getCategoryData();

        EventRegister.on("AUTH_EVENT", this.authEventhandler.bind(this));
    }

    componentDidUpdate(prevProps: CategoryPageProperties, prevState: CategoryPageState) {
        if (prevProps.match?.params.cid !== this.props.match?.params.cid) {
            this.getCategoryData();
        }
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventhandler.bind(this));
    }

    private authEventhandler(status: string) {
        if (status === "force_login") {
            this.setState({
                isUserLoggedIn: false,
            });
        }
    }

    renderMain(): JSX.Element {
        return (
            <>
                <h1>
                    { this.state.name }
                </h1>

                <div className="row">
                {
                    this.state.articles.map(article => (
                        <ArticleItem key={ "article-item-" + article.articleId } article={ article } />
                    ))
                }
                </div>
            </>
        );
    }
}
