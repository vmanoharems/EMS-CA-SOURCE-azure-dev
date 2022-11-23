SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[InsertUpdateVendor]
          (@VendorID int,
		  @VendorNumber nvarchar(30),
           @VendorName nvarchar(100),
           @FirstName nvarchar(30),
           @MiddleName nvarchar(30),
           @LastName nvarchar(30),
           @PrintOncheckAS nvarchar(100),

		   @W9Country nvarchar(100),
           @W9Address1 nvarchar(50),
           @W9Address2 nvarchar(50),
		   @W9Address3 nvarchar(50),
		   @W9City nvarchar(50),
		   @W9State nvarchar(50),
		   @W9Zip nvarchar(50),
		   @RemitCountry nvarchar(100),
		   @RemitAddress1 nvarchar(50),
		   @RemitAddress2 nvarchar(50),
           @RemitAddress3 nvarchar(50),
           @RemitCity nvarchar(50),
           @RemitState nvarchar(50),
           @RemitZip nvarchar(50),

           @UseRemmitAddrs bit,
           @Qualified nvarchar(50),
           @Currency nvarchar(50),
           @DefaultAccount nvarchar(50),
		   @LedgerAccount nvarchar(50),
           @TaxID nvarchar(30),
           @Type nvarchar(50),
           @TaxFormOnFile bit,
           @TaxFormExpiry datetime,
           @DefaultForm nvarchar(50),
           @TaxName nvarchar(50),
           @ForeignTaxId nvarchar(50),
           @PaymentType nvarchar(50),
           @Duecount int,
           @Duetype nvarchar(30),
           @netpercentage decimal(18,2),
           @PaymentAccount nvarchar(50),
           @Required bit,
           @StudioVendorNumber nvarchar(50),
           @IsStudioApproved bit,
           @Status bit,
		   @Warning bit,
		   @DefaultDropdown nvarchar(50),
		   @CreatedBy Int,
		   @ProdID Int,
		   @COAId int,
		   @COAString nvarchar(200),@TransactionCodeString nvarchar(200),@SetId int,@SeriesId int)


		  
As
 Begin


 If (@VendorID=0)

begin

INSERT INTO [dbo].[tblVendor]
           (
		    [VendorNumber]
          , [VendorName]
           ,[FirstName]
           ,[MiddleName]
           ,[LastName]
           ,[PrintOncheckAS]
           ,[W9Country]
           ,[W9Address1]
           ,[W9Address2]
           ,[W9Address3]
           ,[W9City]
           ,[W9State]
           ,[W9Zip]
           ,[RemitCountry]
           ,[RemitAddress1]
           ,[RemitAddress2]
           ,[RemitAddress3]
           ,[RemitCity]
           ,[RemitState]
           ,[RemitZip]
           ,[UseRemmitAddrs]
           ,[Qualified]
           ,[Currency]
           ,[DefaultAccount]
		   ,[LedgerAccount]
           ,[TaxID]
           ,[Type]
           ,[TaxFormOnFile]
           ,[TaxFormExpiry]
           ,[DefaultForm]
           ,[TaxName]
           ,[ForeignTaxId]
           ,[PaymentType]
           ,[Duecount]
           ,[Duetype]
           ,[netpercentage]
           ,[PaymentAccount]
           ,[Required]
           ,[StudioVendorNumber]
           ,[IsStudioApproved]
           ,[Status]
		   ,[Warning]
		   ,[Createddate]
		   ,[CreatedBy]
		   ,[DefaultDropdown]
		   ,ProdID,COAId,COAString,TransactionCodeString,SetId,SeriesId)
     VALUES
           (
		   @VendorNumber,
		   @VendorName ,
           @FirstName ,
           @MiddleName ,
           @LastName ,
           @PrintOncheckAS ,
           @W9Country,
           @W9Address1,
           @W9Address2,
		   @W9Address3,
		   @W9City,
		   @W9State,
		   @W9Zip,
		   @RemitCountry,
		   @RemitAddress1,
		   @RemitAddress2,
           @RemitAddress3,
           @RemitCity,
           @RemitState,
           @RemitZip,
           @UseRemmitAddrs,
           @Qualified,
           @Currency,
           @DefaultAccount,
		   @LedgerAccount,
           @TaxID,
           @Type,
           @TaxFormOnFile,
           @TaxFormExpiry,
           @DefaultForm,
           @TaxName,
           @ForeignTaxId,
           @PaymentType,
           @Duecount,
           @Duetype,
           @netpercentage,
           @PaymentAccount,
           @Required,
           @StudioVendorNumber,
           @IsStudioApproved,
           @Status,
		   @Warning,
		   Getdate(),
		   @CreatedBy,
		   @DefaultDropdown,
		   @ProdID,@COAId,@COAString,@TransactionCodeString,@SetId,@SeriesId)


		  set @VendorID=SCOPE_IDENTITY();
		   End

		   Else

		   Begin

		   
UPDATE [dbo].[tblVendor]
   SET 
   [VendorNumber]= @VendorNumber
      ,[VendorName] = @VendorName
      ,[FirstName] = @FirstName
      ,[MiddleName] = @MiddleName
      ,[LastName] = @LastName
      ,[PrintOncheckAS] = @PrintOncheckAS

       ,[W9Country] = @W9Country
       ,[W9Address1]= @W9Address1
       ,[W9Address2] = @W9Address2
       ,[W9Address3] = @W9Address3
       ,[W9City] = @W9City
       ,[W9State] = @W9State
       ,[W9Zip] = @W9Zip
       ,[RemitCountry] = @RemitCountry
       ,[RemitAddress1] = @RemitAddress1
       ,[RemitAddress2] = @RemitAddress2
       ,[RemitAddress3] = @RemitAddress3
       ,[RemitCity] = @RemitCity
       ,[RemitState] = @RemitState
       ,[RemitZip] = @RemitZip

      ,[UseRemmitAddrs] = @UseRemmitAddrs
      ,[Qualified] = @Qualified
      ,[Currency] = @Currency
      ,[DefaultAccount] = @DefaultAccount
	  ,[LedgerAccount] = @LedgerAccount
      ,[TaxID] = @TaxID
      ,[Type] = @Type
      ,[TaxFormOnFile] = @TaxFormOnFile
      ,[TaxFormExpiry] = @TaxFormExpiry
      ,[DefaultForm] = @DefaultForm
      ,[TaxName] = @TaxName
      ,[ForeignTaxId] = @ForeignTaxId
      ,[PaymentType] = @PaymentType
      ,[Duecount] = @Duecount
      ,[Duetype] = @Duetype
      ,[netpercentage] = @netpercentage
      ,[PaymentAccount] = @PaymentAccount
      ,[Required] = @Required 
      ,[StudioVendorNumber] = @StudioVendorNumber
      ,[IsStudioApproved] = @IsStudioApproved
      ,[Status] = @Status
	  ,[Warning] = @Warning
	 , [DefaultDropdown] = @DefaultDropdown
	  ,[ModifiedDate]=Getdate()
	  ,[ModifiedBy]=@CreatedBy,
	  COAId=@COAId,COAString=@COAString,TransactionCodeString=@TransactionCodeString,SetId=@SetId,SeriesId=@SeriesId
	  Where VendorID=@VendorID

		   End


		   select @VendorID;
		   End
GO