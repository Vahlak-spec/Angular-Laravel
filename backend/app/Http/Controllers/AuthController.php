<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','refresh', 'register']]);
        
    }

     /**
     * Register the user and get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $user = User::where('email', $request['email'])->first();

            if($user) {

                $response['code'] = 409;   
                $response['message'] = 'User with this email already exists!';

                return response()->json($response,  $response['code']);
            } else {

                $fields = $request->validate([
                    'name' => 'required|string|min:3|max:50',
                    'email' => 'required|string|unique:users,email|max:50',
                    'password' => 'required|string|min:3|max:20',
                ]);
                $user = User::create([
                    'name' => $fields['name'],
                    'email' => $fields['email'],
                    'password' => bcrypt($fields['password'])
                ]);

                $credentials = $request->only('email', 'password');
                $token = auth()->attempt($credentials);

                $data['token']= $token;  
                $response['code'] = 200;
                $response['message'] = 'User successfully registered!';
                $response['data'] = $data;
                
                return response()->json($response, $response['code']);
            }
        } catch (\Throwable $th) {
            $response['code'] = $th->getCode();
            $response['message'] = $th->getMessage();

            return response()->json($response, $response['code']);
        }      

        
    }

    /**
     * Log the user in and get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
        try{
            if(!$token = auth()->attempt($credentials)){
                $response['code'] = 401;
                $response['message'] = "Wrong email or password!";

                return response()->json($response, $response['code']);
            } else {
                $data['token']= $token;  
        
                $response['code'] = 200;
                $response['message'] = "Logged in successfully!";
                $response['data'] = $data;

                return response()->json($response,$response['code']);
            }
        } catch(\Throwable $th) {
            $response['code'] = $th->getCode();
            $response['message'] = $th->getMessage();

            return response()->json($response, $response['code']);
        }      
    }

     /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        $response['code'] = 200;
        $response['message'] = "Logged out successfully!";

        return response()->json($response,$response['code']);
    }

     /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth()->user();
        $data['name'] = $user->name;
        $response['code'] = 200;
        $response['message'] = 'Information about my profile!';
        $response['data'] = $data;
        
        return response()->json( $response,  $response['code']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $data['token'] = auth()->refresh();
        $response['code'] = 200;
        $response['message'] = 'Token was refreshed!';
        $response['data'] = $data;
        
        return response()->json($response, $response['code']);
    }
   
}
