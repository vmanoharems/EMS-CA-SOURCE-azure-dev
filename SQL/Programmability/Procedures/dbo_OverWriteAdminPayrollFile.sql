SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[OverWriteAdminPayrollFile]  --exec InsertAdminPayrollFile 'vijay',1,1,1
(
@InvoiceRef varchar(50),
@CompanyID int,
@ProdID int,
@Createdby int,
@PayrollFileXML xml
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @LoadNumber int;
	select @LoadNumber=isnull(Max(LoadNumber),0) from PayrollFile;
	declare @PayrolFileID int;

	declare @InvNumber varchar(100);
	declare @PayrollFileIDDelete int;

	set @InvNumber =(SELECT	 t.n.value('@InvoiceNum[1]', 'varchar(50)') as InvoiceNum FROM @PayrollFileXML.nodes('PayrollData') as t(n));	

	if exists(select PayrollFileID from PayrollFile where InvoiceNumber=@InvNumber and CompanyID=@CompanyID and Status='Post')
	begin
	  
		select 9 as Result,@InvNumber as InvoiceNumber

    end

	else
	begin


	  select @PayrollFileIDDelete=PayrollFileID from PayrollFile where InvoiceNumber=@InvNumber and CompanyID=@CompanyID;

      delete from PayrollFile where InvoiceNumber=@InvNumber and CompanyID=@CompanyID;
	  delete from PayrollUser where PayrollFileID=@PayrollFileIDDelete;
      delete from PayrollExpense where PayrollFileID=@PayrollFileIDDelete;
	  delete from PayrollExpensePost where PayrollFileID=@PayrollFileIDDelete;
      delete from PayrollChecks where PayrollFileID=@PayrollFileIDDelete;

/*
   insert into PayrollFile (PayrollFileXML,LoadNumber,PayrollCount,WorkState,StartDate,EndDate,InvoiceRef#,InvoiceNumber
  ,  Batch,ProjectTitle,ProjectCode,RunDateTime,CompanyID,ProdID,PrintedFlag,InvoicedFlag,PostedFlag,Status,PrintStatus,CreatedDate,Createdby,TotalPayrollAmount)		 
    SELECT 
	@PayrollFileXML,@LoadNumber+1,
	t.n.value('@PayrollCount[1]', 'varchar(50)') as PayrollCount,
	t.n.value('@WorkState[1]', 'varchar(50)') as WorkState,
	t.n.value('@StartDate[1]', 'varchar(50)') as StartDate,
	t.n.value('@EndDate[1]', 'varchar(50)') as EndDate,
	@InvoiceRef,
	t.n.value('@InvoiceNum[1]', 'varchar(50)') as InvoiceNum,
	t.n.value('@Batch[1]', 'varchar(50)') as Batch,
	t.n.value('@ProjectTitle[1]', 'varchar(50)') as ProjectTitle,
	t.n.value('@ProjectCode[1]', 'varchar(50)') as ProjectCode,
	t.n.value('@RunDateTime[1]', 'varchar(50)') as RunDateTime,
	@CompanyID,@ProdID,0,0,0,'Obtained','Unavailable',CURRENT_TIMESTAMP,@Createdby,
	t.n.value('sum(Payroll/Expense/@PaymentAmount)','float') AS TotalPayrollAmount			
FROM @PayrollFileXML.nodes('PayrollData') as t(n)	


select @PayrolFileID=@@IDENTITY;


insert into PayrollUser (Expensecount,UnionName,UnionCode,JobTitle,FirstName,LastName,SSN,CheckNumber,EmployeeId,PayrollFileID,
CreatedDate,Createdby,TotalPaymentAmount)	 
    SELECT
	t.n.value('@ExpenseCount[1]', 'varchar(50)') as ExpenseCount,
	t.n.value('@UnionName[1]', 'varchar(50)') as UnionName,
	t.n.value('@UnionCode[1]', 'varchar(50)') as UnionCode,
	t.n.value('@JobTitle[1]', 'varchar(50)') as JobTitle,
	t.n.value('@FirstName[1]', 'varchar(50)') as FirstName,
	t.n.value('@LastName[1]', 'varchar(50)') as LastName,
	t.n.value('@SSN[1]', 'varchar(50)') as SSN,
	 t.n.value('@CheckNum[1]', 'varchar(50)') as CheckNum,
	  t.n.value('@EmployeeId[1]', 'varchar(50)') as EmployeeId,
	 @PayrolFileID,CURRENT_TIMESTAMP,@Createdby,
	 t.n.value('sum(Expense/@PaymentAmount)','float') AS TotalPaymentAmount
FROM @PayrollFileXML.nodes('PayrollData/Payroll') as t(n)	

----------------------------

  insert into PayrollChecks (PdfCheckNum,PayrollUserID,CheckPDF,PayrollFileID)

	   SELECT 
	   t.n.value('@PdfCheckNum[1]', 'varchar(50)') as PdfCheckNum,
	   b.PayrollUserID,
	   t.n.value('../CheckPdf[1]', 'nvarchar(max)') as CheckPdf,	  
	   @PayrolFileID	
    FROM @PayrollFileXML.nodes('PayrollData/Payroll/CheckPdf') as t(n)
	left outer join PayrollUser as b on  t.n.value('(../@CheckNum)[1]', 'varchar(100)') =b.CheckNumber
	 and 
	 t.n.value('(../@FirstName)[1]', 'varchar(100)')=b.FirstName and t.n.value('(../@LastName)[1]', 'varchar(100)')=b.LastName
	 and b.PayrollFileID=@PayrolFileID;

  insert into PayrollExpense (Freefield1,Freefield2,FreeField3,PaymentAmount,PaymentAccount,PayDescription,EpisodeCode,
	  SetCode,LocationCode,ZZ,ExpenseOrd,TaxCode,LineOrder,Insurance,CreatedDate,Createdby,PayrollUserID,PayrollFileID)

	   SELECT 
	   t.n.value('@FreeField1[1]', 'varchar(50)') as FreeField1,
	   t.n.value('@FreeField2[1]', 'varchar(50)') as FreeField2,
	   t.n.value('@FreeField3[1]', 'varchar(50)') as FreeField3,
	   t.n.value('@PaymentAmount[1]', 'varchar(50)') as PaymentAmount,
	   t.n.value('@PaymentAccount[1]', 'varchar(50)') as PaymentAccount,
	   t.n.value('@PayDescription[1]', 'varchar(50)') as PayDescription,
	   t.n.value('@EpisodeCode[1]', 'varchar(50)') as EpisodeCode,
	   t.n.value('@SetCode[1]', 'varchar(50)') as SetCode,
	   t.n.value('@LocationCode[1]', 'varchar(50)') as LocationCode,
	   t.n.value('@ZZ[1]', 'varchar(50)') as ZZ,
	    t.n.value('@ExpenseOrd[1]', 'varchar(50)') as ExpenseOrd,
       t.n.value('@TaxCode[1]', 'varchar(50)') as TaxCode,
	   t.n.value('@LineOrder[1]', 'varchar(50)') as LineOrder,
	    t.n.value('@Insurance[1]', 'varchar(50)') as Insurance,
	CURRENT_TIMESTAMP,@Createdby,b.PayrollUserID,@PayrolFileID	
    FROM @PayrollFileXML.nodes('PayrollData/Payroll/Expense') as t(n)
	left outer join PayrollUser as b on  t.n.value('(../@CheckNum)[1]', 'varchar(100)') =b.CheckNumber
	 and 
	 t.n.value('(../@FirstName)[1]', 'varchar(100)')=b.FirstName and t.n.value('(../@LastName)[1]', 'varchar(100)')=b.LastName
	 and b.PayrollFileID=@PayrolFileID;

select 1 as Result,@InvNumber as InvoiceNumber
*/
exec InsertAdminPayrollFile @InvoiceRef ,@CompanyID,@ProdID,@Createdby,@PayrollFileXML 
select 1 as Result,@InvNumber as InvoiceNumber


	end
END




GO