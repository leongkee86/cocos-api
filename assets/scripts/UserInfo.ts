import { _decorator, Component, Label, Node, ScrollView, UITransform } from 'cc';
import { ApiManager } from './ApiManager';
const { ccclass, property } = _decorator;

@ccclass('UserInfo')
export class UserInfo extends Component
{
    @property(Label) private infoLabel : Label = null;
    @property(Node) private contentNode : Node = null!;
    @property(ScrollView) private scrollView : ScrollView = null;

    private userCount : number = 0;
    private timeoutId : ReturnType<typeof setTimeout> | null = null;

    start()
    {
        this.updateUserInfo();
    }

    public updateUserInfo()
    {
        ApiManager.get(
            "users",
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

        if (_users.length > 0)
        {
            for(let user of _users)
            {
                _userCount++;

                _userInfoString += `--- User ${ _userCount } ---`;
                _userInfoString += "\nName: " + user.name;
                _userInfoString += "\nGender: " + user.gender;
                _userInfoString += ( user.message ) ? "\nMessage: " + user.message : "";
                _userInfoString += "\n\n";
            }

            this.infoLabel.string = _userInfoString;
        }
        else
        {
            this.infoLabel.string = "\nThere is no data to display...";
        }
        
        if (_userCount !== this.userCount)
        {
            const _infoLabelTransform = this.infoLabel.node.getComponent( UITransform )!;
            const _contentTransform = this.contentNode.getComponent( UITransform )!;

            this.scheduleOnce( () =>
            {
                _contentTransform.setContentSize( _contentTransform.width, _infoLabelTransform.height );
                this.scrollView.scrollToBottom( 0.2, true );
            },
            0 );

            this.userCount = _userCount;
        }

        if (this.timeoutId !== null)
        {
            clearTimeout( this.timeoutId );
        }

        this.timeoutId = setTimeout( () =>
        {
            this.updateUserInfo();
        }
        , 5000 );
    }

    public clickToDeleteAllUsers()
    {
        ApiManager.delete(
            "delete-all-users",
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
