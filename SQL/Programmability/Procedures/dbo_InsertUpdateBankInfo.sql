SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateBankInfo]
	-- Add the parameters for the stored procedure here
	@BankId int,
	@Bankname nvarchar(50),
	@CompanyId int,
	@Address1 nvarchar(50),
	@Address2 nvarchar(50),
	@Address3 nvarchar(50),
	@city nvarchar(50),
	@State nvarchar(50),
	@zip nvarchar(10),
	@Country nvarchar(50),
	@RoutingNumber nvarchar(50),
	@AccountNumber nvarchar(50),
	@BranchNumber nvarchar(50),
	@Branch nvarchar(50),
	@Clearing int,
	@Cash int,
	@Suspense int,
	@Bankfees int,
	@Deposits int,
	@SourceCodeID int,
	@CurrencyID int ,
	@Status bit,
	@PostiivePay bit,
	@Prodid int,
	@CreatedBy int


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@BankId=0)
	begin
	INSERT INTO [dbo].[BankInfo]
           ([Bankname],[CompanyId],[Address1],[Address2],[Address3],[city],[State],[zip],[Country],[RoutingNumber]
           ,[AccountNumber],[BranchNumber],[Branch],[Clearing],[Cash],[Suspense],[Bankfees],[Deposits]
           ,[SourceCodeID],[CurrencyID],[Status],[PostiivePay],[Prodid],[CreatedDate],[CreatedBy]
           )
     VALUES(
	 @Bankname,@CompanyId,@Address1,@Address2,@Address3,@city,@State,@zip,@Country,@RoutingNumber,@AccountNumber,@BranchNumber,@Branch,
	 @Clearing,@Cash,@Suspense,@Bankfees,@Deposits,@SourceCodeID,@CurrencyID,@Status,@PostiivePay,@Prodid,GETDATE(),@CreatedBy
	 )
	set @BankId= SCOPE_IDENTITY()
	
	end
	else
	begin
	update [dbo].[BankInfo] set
           [Bankname]=@Bankname,[CompanyId]=@CompanyId,[Address1]=@Address1,[Address2]=@Address2,[Address3]=@Address3,[city]=@city,
		   [State]=@State,[zip]=@zip,[Country]=@Country,[RoutingNumber]=@RoutingNumber,[AccountNumber]=@AccountNumber,
		   [BranchNumber]=@BranchNumber,[Branch]=@Branch,[Clearing]=@Clearing,[Cash]=@Cash,[Suspense]=@Suspense,[Bankfees]=@Bankfees,
		   [Deposits]=@Deposits,[SourceCodeID]=@SourceCodeID,[CurrencyID]=@CurrencyID,[Status]=@Status,[PostiivePay]=@PostiivePay,
		   [Prodid]=@Prodid,[ModifiedDate]=GETDATE(),[ModifiedBy]=@CreatedBy where BankId=@BankId

		  
	end
	select @BankId
END




GO