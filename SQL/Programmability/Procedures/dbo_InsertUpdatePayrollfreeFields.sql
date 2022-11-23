SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdatePayrollfreeFields]

@PayrollFreeFieldID int,
@FreeField1 int,
@FreeField2 int,
@FreeField3 int,
@createdby  int,
@ProdID int,
@CompanyId int


As

Begin


IF not exists(select * from PayrollFreeField where CompanyId=@CompanyId)

begin
	INSERT INTO PayrollFreeField
           ([FreeField1]
           ,[FreeField2]
           ,[FreeField3]
           ,[createddate]
           ,[createdby]
           ,[ProdID]
		   ,[CompanyId])
		   
     VALUES
           (@FreeField1,@FreeField2, @FreeField3,getdate(),@createdby,@ProdID,@CompanyId) 
         end  
		  else 
		Update PayrollFreeField 
		Set 
		FreeField1=@FreeField1,
		FreeField2=@FreeField2,
        FreeField3=@FreeField3,
		modifiedby=@createdby,
		ProdID=@ProdID,
		modifieddate=getdate()
		
		where CompanyId= @CompanyId
END





GO