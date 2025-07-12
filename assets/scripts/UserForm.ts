import { _decorator, Component, EditBox, Node, RichText, Toggle, url } from 'cc';
import { ApiManager } from './ApiManager';
import { API_BASE_URL } from '../config';
import { UserInfo } from './UserInfo';
const { ccclass, property } = _decorator;

@ccclass('UserForm')
export class UserForm extends Component
{
    @property(EditBox) private nameInputBox : EditBox = null;
    @property(Node) private genderToggleGroup : Node = null;
    @property(Node) private defaultGenderToggle : Toggle = null;
    @property(EditBox) private messageInputBox : EditBox = null;
    @property(RichText) private resultLabel : RichText = null;

    @property(UserInfo) private userInfo : UserInfo = null;

    public clickToSubmit()
    {
        let _name : string = this.nameInputBox.string;
        let _gender : string = "";
        let _message : string = this.messageInputBox.string;

        let _selectedGenderToggle : Toggle = this.getSelectedToggle( this.genderToggleGroup );
        if (_selectedGenderToggle)
        {
            _gender = _selectedGenderToggle.getComponentInChildren(RichText).string;
        }

        ApiManager.post(
            `${ API_BASE_URL }/add-user`,
            {
                name : _name,
                gender : _gender,
                message: _message
            },
            ( error, result ) =>
            {
                if (error)
                {
                    this.resultLabel.string = `<color=FF0000>Submission failed... ${ error.message }</color>`;
                }
                else
                {
                    this.resultLabel.string = "<color=FFFF00>Submission successful.</color>";

                    this.nameInputBox.string = "";
                    this.messageInputBox.string = "";
                    this.defaultGenderToggle.isChecked = true;

                    setTimeout( () => { this.resultLabel.string = ""; }, 5000 );

                    this.userInfo.updateUserInfo();
                }
            }
        );
    }

    private getSelectedToggle( toggleGroupNode : Node ) : Toggle
    {
        const _toggles = toggleGroupNode.getComponentsInChildren( Toggle );

        for (let _toggle of _toggles)
        {
            if (_toggle.isChecked)
            {
                return _toggle;
            }
        }

        return null;
    }
}


