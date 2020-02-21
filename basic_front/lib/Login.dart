import 'package:basic_front/Volunteer/Volunteer_InactiveDashboard.dart';
import 'package:basic_front/ForgotPassword.dart';
import 'package:basic_front/RegisterAccount.dart';
import 'package:flutter/material.dart';

import 'Bus_Driver/BusDriver_InactiveDashboard.dart';
import 'REST/LoginCalls.dart';
import 'Staff/Staff_ActiveDashboard.dart';
import 'Volunteer_Captain/VolunteerCaptain_InactiveDashboard.dart';

class LoginPage extends StatefulWidget {
  LoginPage({Key key}) : super(key: key);

  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {

  @override
  void initState()
  {
    super.initState();
  }

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  FocusNode usernameNode = new FocusNode();
  FocusNode passwordNode = new FocusNode();

  Widget buildHeader ()
  {
    return Container(
      child: Text(
        "Orlando Children's Church",
        style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
        textAlign: TextAlign.center,
      ),
      margin: EdgeInsets.only(top: 120, bottom: 50),
    );
  }

  Widget buildEmailRow ()
  {
    return Container(
      child: IntrinsicHeight(
        child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>
            [
              Container(
                child: Icon(
                  Icons.email,
                  size: 40,
                ),
                decoration: new BoxDecoration(
                  color: Colors.blue,
                  borderRadius: new BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
                padding: EdgeInsets.only(left: 5),
              ),
              Flexible(
                child: TextField(
                  onSubmitted: (String value) {
                    FocusScope.of(context).requestFocus(passwordNode);
                  },
                  textAlign: TextAlign.left,
                  controller: _emailController,
                  decoration: new InputDecoration(
                    hintText: 'Email',
                    border: new OutlineInputBorder(
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(20),
                        bottomRight: Radius.circular(20),
                      ),
                      borderSide: new BorderSide(
                        color: Colors.black,
                        width: 0.5,
                      ),
                    ),
                  ),
                ),
              ),
            ]
        ),
      ),
      margin: EdgeInsets.only(left: 25, right: 25, bottom: 25),
    );
  }

  Widget buildPasswordRow ()
  {
    return Container(
      child: IntrinsicHeight(
        child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>
            [
              Container(
                child: Icon(
                  Icons.lock,
                  size: 40,
                ),
                decoration: new BoxDecoration(
                  color: Colors.blue,
                  borderRadius: new BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
                padding: EdgeInsets.only(left: 5),
              ),
              Flexible(
                child: TextField(
                  textAlign: TextAlign.left,
                  focusNode: passwordNode,
                  controller: _passwordController,
                  obscureText: true,
                  decoration: new InputDecoration(
                    hintText: 'Password',
                    border: new OutlineInputBorder(
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(20),
                        bottomRight: Radius.circular(20),
                      ),
                      borderSide: new BorderSide(
                        color: Colors.black,
                        width: 0.5,
                      ),
                    ),
                  ),
                ),
              ),
            ]
        ),
      ),
      margin: EdgeInsets.only(left: 25, right: 25, bottom: 35),
    );
  }

  Widget buildForgotOrRegister ()
  {
    return Container(
      child: Column(
        children: <Widget>[
          Builder(
              builder: (context) => Center(
                  child: FlatButton(
                    child: const Text('Forgot Password?'),
                    onPressed: ()
                    {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => ForgotPasswordPage()),
                      );
                    },
                  )
              )
          ),
          Text(
              "OR"
          ),
          Builder(
              builder: (context) => Center(
                  child: FlatButton(
                    child: const Text('Register Account'),
                    onPressed: ()
                    {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => RegisterAccountPage()),
                      );
                    },
                  )
              )
          )
        ],
      ),
    );
  }

  Widget buildLoginButton ()
  {
    return Container(
      child: SizedBox(
        child: RaisedButton(
          child: Text(
              "Login",
              style: TextStyle(fontSize: 24, color: Colors.black)
          ),
          onPressed: () {
            POST_InitialLogin(_emailController.text, _passwordController.text, context);
            // LoginCheck(_emailController.text);
          },
          color: Colors.amber,
        ),
        height: 50,
        width: double.infinity,
      ),
      margin: EdgeInsets.all(25),
    );
  }

  @override
  Widget build(BuildContext context)
  {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints viewportConstraints) {
        return Scaffold (
          body: SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: viewportConstraints.maxHeight,
              ),
              child: IntrinsicHeight(
                child: Column(
                  children: <Widget>[
                    Expanded(
                        child: Column(
                          children: <Widget>[
                            buildHeader(),
                            buildEmailRow(),
                            buildPasswordRow(),
                            buildForgotOrRegister(),
                          ],
                        )
                    ),
                    buildLoginButton(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}




