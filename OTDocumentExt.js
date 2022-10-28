sap.ui.define(["sap/ui/integration/Extension"], function (Extension) {
    "use strict";

    var OTDocumentExt = Extension.extend("lkrr.adaptivecard.embedded.opentext.OTDocumentExt");
    var sfuserid;
    var firstname;
    var lastname;
    var user_email;

    OTDocumentExt.prototype.init = function () {
        Extension.prototype.init.apply(this, arguments);
        this.attachAction(this._handleAction.bind(this));
    };

    OTDocumentExt.prototype.getData = function () {
        return Promise.all([this.getUserProfile()]).then(
            function (aData) {
                //console.log(aData);
                const profile = aData[0];

                firstname = aData[0].d.firstName;
                lastname = aData[0].d.lastName;
                user_email = aData[0].d.email;
                console.log("What I got: " + firstname + " " + lastname + " " + user_email);

                const aPreparedData = {
                    userProfile: profile,
                };
                return aPreparedData;
            }
        );
    };

    OTDocumentExt.prototype.getUserProfile = function () {
        const oCard = this.getCard();
        const oParameters = oCard.getCombinedParameters();
        const sfuserid = oParameters.currentLoginSFUserID;

        //console.log(sfuserid);

        return oCard
            .request({
                url:
                    "{{destinations.SFSFDestination2}}/odata/v2/User('"+sfuserid+"')",
                withCredentials: true,
                parameters: {
                    $format: "json",
                    $select: "firstName,lastName,email"
                },
            })
            .then(function (aData) {
                //console.log(aData);
                /*let result = aData.d.results.map(function (employeeProfile) {
                    
                    return {
                        firstName: employeeProfile.firstName,
                        lastName: employeeProfile.lastName
                    };
                });*/
                //return result;
                return aData;
            });
    };

	/* Custom event handler for the submit event.
	Intercepts submit action, performs validation and/or data modifications. */
    OTDocumentExt.prototype._handleAction = function (oEvent) {
        var oCard = this.getCard(),
            sActionType = oEvent.getParameter("type"),
            mParams = oEvent.getParameter("parameters"),
            mSubmitData = mParams.data;

        //var testdata = this.getData();
        console.log(mSubmitData);

        if (sActionType !== "Submit") {
            return;
        }

        if (mSubmitData.TemplateID == '1') {
            console.log("Template #1");

            var element = document.createElement("iframe");
            element.setAttribute('id', 'opentext');
            element.setAttribute('frameborder', '0');

            //*****comment next line to prevent generating the document*****
            //element.setAttribute('src', 'https://create-xecm4sfsf-de-0032.xecm.org/sfpd/web/batch?targetid=103010&template=Nebenabrede%20-%20Urlaub&channel=centralprint&module=User');
            //element.setAttribute('src', 'https://create-xecm4sfsf-de-0032.xecm.org/sfpd/web/batch?targetid=103010&template=EmploymentLetter&channel=centralprint&module=User');

            document.body.appendChild(element);

        }
        if (mSubmitData.TemplateID == '2') {
            console.log("Template #2");
        }

        oEvent.preventDefault();

        if (mSubmitData.TemplateID == '1') {
            oCard.showMessage("Request successful. Document sent.", "Success");
            return;
        }

        /*if (mSubmitData.ProductName.length > 20) {
            oCard.showMessage("{i18n>ERROR_LONG_PRODUCT_NAME}", "Error");
            return;
        }*/

        // Submits to a mock server
        /*oCard.request({
            "url": "samples/adaptive/extensionSample/MOCK.json",
            "method": "GET",
            "parameters": mSubmitData
        }).then(function () {
            oCard.showMessage("{i18n>SUCCESSFUL_SUBMIT}", "Success");
        }).catch(function (sErrorMessage) {
            oCard.showMessage(sErrorMessage, "Error");
        });*/
    };
    return OTDocumentExt;
});
