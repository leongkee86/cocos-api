export class ApiManager
{
    private static isInitialized : boolean = false;
    private static configData : any = null;

    private static async initialize()
    {
        if (!this.isInitialized)
        {
            const _response = await fetch( location.href.replace( "/index.html", "" ) + "/config.json" );

            if (!_response.ok)
            {
                throw new Error( "Failed to load config" );
            }

            this.configData = await _response.json();

            this.isInitialized = true;
        }
    }

    public static getBaseUrl() : string
    {
        return this.configData.api_base_url;
    }

    // GET with callback
    public static async get( url: string, callback: ( err: any, result?: any ) => void )
    {
        await this.initialize();

        fetch( `${ this.getBaseUrl() }/${ url }` )
            .then( ( res ) => res.json() )
            .then( ( data ) => callback( null, data ) )
            .catch( ( error ) => callback( error ) );
    }

    // POST with callback
    public static async post( url: string, payload: any, callback: ( err: any, result?: any ) => void )
    {
        await this.initialize();

        fetch( `${ this.getBaseUrl() }/${ url }`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( payload )
        } )
        .then( async ( res ) =>
        {
            if (!res.ok)
            {
                const errorData = await res.json().catch( () => ( {} ) );
                const error =
                {
                    status: res.status,
                    message: errorData.message || res.statusText,
                    data: errorData
                };
                throw error;
            }
            return res.json();
        } )
        .then( ( data ) => callback( null, data ) )
        .catch( ( error ) => callback( error ));
    }

    // DELETE with callback
    public static async delete( url: string, callback: (err: any, result?: any) => void )
    {
        await this.initialize();

        fetch( `${ this.getBaseUrl() }/${ url }`,
        {
            method: 'DELETE',
            headers:
            {
                'Content-Type': 'application/json',
            }
        })
        .then( async ( res ) =>
        {
            if (!res.ok)
            {
                const errorData = await res.json().catch( () => ( {} ) );
                const error =
                {
                    status: res.status,
                    message: errorData.message || res.statusText,
                    data: errorData
                };
                throw error;
            }
            return res.json().catch( () => ( {} ) ); // In case DELETE returns empty body
        } )
        .then( ( data ) => callback( null, data ) )
        .catch( ( error ) => callback( error ) );
    }
}
