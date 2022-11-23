SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[addproductionaccessforuser]

@AdminUserid int,
@ProdID int

as
Begin

If not exists (select *  from UserProduction  where UserId=@AdminUserid and Prodid=@ProdID)
begin

INSERT INTO [dbo].[UserProduction]
           ([UserId]
           ,[Prodid]
           ,[Createddate]
           ,[modifieddate]
           ,[createdby]
           ,[modifiedby]
           ,[Groupbatchaccess]
           ,[Canclose]
           ,[Allbatchaccess])
     VALUES
           (@AdminUserid,@ProdID,getdate(),null,1,null,0,0,0)
		   select SCOPE_IDENTITY() as UserproductionId;

		   end

		   else

		   begin
		   select UserproductionId  from UserProduction  where UserId=@AdminUserid and Prodid=@ProdID
		   end

		   end





GO