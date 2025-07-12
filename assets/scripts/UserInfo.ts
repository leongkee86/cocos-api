import { _decorator, Component, Label, Node, ScrollView, UITransform } from 'cc';
import { ApiManager } from './ApiManager';
import { API_BASE_URL } from '../config';
const { ccclass, property } = _decorator;

@ccclass('UserInfo')
export class UserInfo extends Component
{
    @property(Label) private infoLabel : Label = null;
    @property(Node) private contentNode: Node = null!;
    @property(ScrollView) private scrollView : ScrollView = null;

    start()
    {
        this.updateUserInfo();
    }

    public updateUserInfo()
    {
        ApiManager.get(
            `${ API_BASE_URL }/users`,
            ( error, result ) =>
            {
                if (!error)
                {
                    this.showUserInfo( result );
                }
            }
        );
    }

    private showUserInfo( result : any )
    {
        let _userInfoString = "\n";

        let _users : any[] = result;
        let _userCount = 0;

        for(let user of _users)
        {
            _userCount++;

            _userInfoString += `--- User ${ _userCount } ---`;
            _userInfoString += "\nName: " + user.name;
            _userInfoString += "\nGender: " + user.gender;
            _userInfoString += "\nMessage: " + user.message;
            _userInfoString += "\n\n";
        }

        this.infoLabel.string = _userInfoString;

        const _infoLabelTransform = this.infoLabel.node.getComponent( UITransform )!;
        const _contentTransform = this.contentNode.getComponent( UITransform )!;

        this.scheduleOnce( () =>
        {
            _contentTransform.setContentSize( _contentTransform.width, _infoLabelTransform.height );
            this.scrollView.scrollToBottom( 0.2, true );
        },
        0 );
    }

    public clickToDeleteAllUsers()
    {
        ApiManager.delete(
            `${ API_BASE_URL }/delete-all-users`,
            ( error, result ) =>
            {
                if (!error)
                {
                    this.updateUserInfo();
                }
            }
        );
    }
}
