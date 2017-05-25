# Azure AD

## Dependencies and licenses

- The [azure-activedirectory-library-for-js](https://github.com/AzureAD/azure-activedirectory-library-for-js) project from Microsoft (Apache license)
- A wrapper for Microsoft's ADAL library from [n2-O365](https://github.com/DariuS231/n2-O365) (MIT license)

The Microsoft library is included in a `<script>` tag from the Microsoft CDN. Parts of the n2-O365 project was copied into the `O365Adal` service and modified for use as an Angular service.

## Loading the library

https://stackoverflow.com/questions/35119451/adal-library-gets-mangled-when-used-with-systemjs-loader-referenceerror-authe#35119452

Basically, I skipped TOH's module system (which uses SystemJS) and just added a script link to Microsoft's CDN:

    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.0/js/adal.min.js"></script>

## Reply URLs

You will get a big error from Azure if the callback URL your app tries to pass (which is the URL that needs authentication) isn't in the "reply URLs" array in the Azure portal.

To add it, go to the "Reply URLs" entry in the application page in the Azure portal, which is right underneath the "Properties" entry, and add the URL. You may need to add a version with and without a trailing slash.

## I have it authing to AAD, now what?

You get these user property things (see the /azuread route), which are decoded from a JWT. The user properties found in the JWT seem to be documented here: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-token-and-claims

Seems like the one I might want is `sub`, for "subject"? "Identifies the principal about which the token asserts information, such as the user of an application. This value is immutable and cannot be reassigned or reused, so it can be used to perform authorization checks safely."

There's also a `roles` property, which "[r]epresents all application roles that the subject has been granted both directly and indirectly through group membership and can be used to enforce role-based access control. Application roles are defined on a per-application basis, through the appRoles property of the application manifest."

There's also `oid`, for "Object ID", which "[c]ontains a unique identifier of an object in Azure AD. This value is immutable and cannot be reassigned or reused. Use the object ID to identify an object in queries to Azure AD." Not clear what this is? What is the object I get back after authentication?

There's also `groups`, which "[p]rovides object IDs that represent the subject's group memberships. These values are unique (see Object ID) and can be safely used for managing access, such as enforcing authorization to access a resource."
