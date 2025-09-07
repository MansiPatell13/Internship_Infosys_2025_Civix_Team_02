import React,{useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import img from "/img.jpg";

const ResetPassword = () => {
     const [password, setpassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [error, seterror] = useState("");

    const validatePass = (pass) => {
        const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return rules.test(pass);
    };

    const handleSubmit = (e) =>{
        e.preventDefault(e);

        if(!validatePass(password)){
            seterror("Password must be at least 8 characters, include uppercase, lowercase, and a number.");
            setpassword("");
            setconfirmPassword("");
        }
        else if(password !== confirmPassword){
            seterror("Passwords do not match");
        }
        else{
            seterror("");
            setpassword("");
            setconfirmPassword("");
            alert("Password set successfully!");
        }
    };
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* left */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <div className="">
          <h1 className="fw-bold text-center">
            RESET <span className="text-success">PASSWORD</span>
          </h1>
        </div>
        <form className="mx-auto mt-4" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label mb-3">Enter new Password</label>
            <input
              type="password"
              placeholder="********"
              className="form-control border-black"
              value={password}
              onChange={(e) => {setpassword(e.target.value)}}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label mb-3">Confirm Password</label>
            <input
              type="password"
              placeholder="********"
              className="form-control border-black"
              value={confirmPassword}
              onChange={(e) => {setconfirmPassword(e.target.value)}}
              required
            />
          </div>

            {error && <p className='text-danger'>{error}</p>}
            
          <button type="submit" className="btn btn-success w-100 mt-3">
            Reset Password
          </button>
        </form>
      </div>

      {/* right */}
      <div className="col-md-6 p-0 h-100">
                <img
                  src={img}
                  alt="img"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
  )
}

export default ResetPassword